const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = require('../../src/db');
const Geolocator = require('../../client/src/modules/Geolocator');


router.post('/', function(req, res, next) {

	if (req.session && req.session.login) {
		const post = req.body;
		if (post.age.max > 54) {
			post.age.max = 1000;
		}
		db.query('SELECT user_id, location_lat, location_lon, gender, sexual_orientation FROM users WHERE login = ? LIMIT 1', [req.session.login], function (error, result, fields) {
			if (error) throw error;
			if (result[0]) {
				const myId = result[0].user_id;
				const myLat = result[0].location_lat;
				const myLon = result[0].location_lon;
				const gender = result[0].gender;
				var sexual_orientation = [];
				if (result[0].sexual_orientation === 1) {
					sexual_orientation[0] = 1;
					sexual_orientation[1] = 1;
				}
				else if (result[0].sexual_orientation === 2) {
					sexual_orientation[0] = 2;
					sexual_orientation[1] = 2;
				}
				else {
					sexual_orientation[0] = 1;
					sexual_orientation[1] = 2;
				}
				var orderBy;
				if(post.orderBy === "ageDesc") {
					orderBy = 'age DESC';
				}
				else {
					orderBy = 'age ASC';
				}
				db.query('SELECT users.user_id, login, first_name, gender, location_lat, location_lon, TIMESTAMPDIFF(YEAR, CONCAT(birth_year, "-", birth_month, "-", birth_day), CURDATE()) AS age, pictures.img_url FROM users ' +
				'INNER JOIN pictures ' +
				'ON pictures.pic_id = users.profile_pic ' +
				'WHERE users.user_id != ? AND ' +
				'email IS NOT NULL AND ' +
				'first_name IS NOT NULL AND ' +
				'last_name IS NOT NULL AND ' +
				'location_lat IS NOT NULL AND ' +
				'location_lon IS NOT NULL AND ' +
				'(gender = ? OR gender = ?) AND ' +
				'TIMESTAMPDIFF(YEAR, CONCAT(birth_year, "-", birth_month, "-", birth_day), CURDATE()) BETWEEN ? AND ? AND ' +
				'profile_pic IS NOT NULL AND ' +
				'(sexual_orientation = ? OR sexual_orientation = 3) AND ' +
				'bio IS NOT NULL AND ' +
				'bio != "" ' +
				'ORDER BY ' + orderBy,
				[myId, sexual_orientation[0], sexual_orientation[1], post.age.min, post.age.max, gender], function (error, results, fields) {
					if (error) throw error;
					if (results[0]) {
						results.push({location_lat: myLat, location_lon: myLon});
						new Promise((resolve, reject) => {
							var users = [];
							for (let key in results) {
								const actualUser = results[key];

								db.query('SELECT block_id FROM blocked_users WHERE (user_id = ? AND blocked_by_user_id = ?) OR (user_id = ? AND blocked_by_user_id = ?) LIMIT 1',
								[actualUser.user_id, myId, myId, actualUser.user_id], function (error, res) {
									if (error) throw error;

											if (!res[0]) {
												Geolocator.calcDistance(myLat, myLon, actualUser.location_lat, actualUser.location_lon, (distance) => {
													distance = parseInt(distance, 10);
													if (post.distance > 159 || distance <= post.distance) {
														db.query('SELECT interests.interest_name FROM interests INNER JOIN user_interests ON user_interests.interest_id = interests.interest_id WHERE user_interests.user_id = ?', [actualUser.user_id], function (error, res) {
															if (error) throw error;
															if (post.interests.every(v => res.find(i => i.interest_name === v)) || key == results.length - 1) {
																db.query('SELECT (SELECT COUNT(user_id) FROM views WHERE user_id = ?) AS views, (SELECT COUNT(user_id) FROM likes WHERE user_id = ?) AS likes;', [actualUser.user_id, actualUser.user_id], function (error, res) {
																	if (error) throw error;
																	if (res[0]) {
																		const popularity = res[0].views === 0 ? 1 : (res[0].likes / res[0].views) * 4 + 1;
																		if ((popularity >= post.popularity.min && popularity <= post.popularity.max) || key == results.length - 1) {
																			db.query('SELECT like_id FROM likes WHERE user_id = ? AND liked_by_user_id = ? LIMIT 1', [actualUser.user_id, myId], function (error, res) {
																				if (error) throw error;
																				const youLiked = res[0] ? true : false;
																				db.query('SELECT like_id FROM likes WHERE user_id = ? AND liked_by_user_id = ? LIMIT 1', [myId, actualUser.user_id], function (error, res) {
																					if (error) throw error;
																					const likedYou = res[0] ? true : false;
																					db.query('SELECT view_id FROM views WHERE user_id = ? AND seen_by_user_id = ? LIMIT 1', [myId, actualUser.user_id], function (error, res) {
																						if (error) throw error;
																						const lookedYou = res[0] ? true : false;
																						db.query('SELECT COUNT(1) FROM user_interests WHERE user_id = ? OR user_id = ? GROUP BY interest_id HAVING COUNT(1) > 1', [myId, actualUser.user_id], function (error, res) {
																							if (error) throw error;
																							if(key == results.length - 1) {
																								resolve(users);
																							}
																							else if (!((post.youLiked && !youLiked) || (post.likedYou && !likedYou) || (post.lookedYou && !lookedYou))) {
																								users.push({
																									login: actualUser.login,
																									profilePic: actualUser.img_url,
																									first_name: actualUser.first_name,
																									age: actualUser.age,
																									gender: actualUser.gender,
																									distance: distance === 0 ? 1 : distance,
																									interests: res.length,
																									youLiked: youLiked,
																									likedYou: likedYou,
																									popularity: popularity
																								});
																							}
																						});
																					});
																				});
																			});
																		}
																	}
																});
															}
														});
													}
												});
											}
								});
							}
						})
						.then(users => {
							if(post.orderBy === "distance") {
								const compareDistance = (a,b) => {
									if (a.distance < b.distance) {
										return -1;
									}
									if (a.distance > b.distance) {
										return 1;
									}
									return 0;
								}
								users.sort(compareDistance);
							}
							else if(post.orderBy === "popularityAsc") {
								const compareInterests = (a,b) => {
									if (a.popularity < b.popularity) {
										return -1;
									}
									if (a.popularity > b.popularity) {
										return 1;
									}
									return 0;
								}
								users.sort(compareInterests);
							}
							else if(post.orderBy === "popularityDesc") {
								const compareInterests = (a,b) => {
									if (a.popularity < b.popularity) {
										return 1;
									}
									if (a.popularity > b.popularity) {
										return -1;
									}
									return 0;
								}
								users.sort(compareInterests);
							}
							else if(post.orderBy === "interests" || !post.orderBy) {
								const compareInterests = (a,b) => {
									if (a.interests < b.interests) {
										return 1;
									}
									if (a.interests > b.interests) {
										return -1;
									}
									return 0;
								}
								users.sort(compareInterests);
							}
							res.json({results: users.slice(0, 50)});
						})
					}
					else {
						res.json({results: []});
					}
				});
			}
			else {
				res.sendStatus(200);
			}
		});
	}
	else {
		res.sendStatus(200);
	}
});

module.exports = router;
