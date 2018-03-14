const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = require('../../src/db');

router.post('/', function(req, res, next) {
	if (req.session && req.session.login) {
		var profileInfos = {};
		var pictures = [];
		var interests = [];

		db.query('SELECT block_id FROM blocked_users WHERE (user_id = (SELECT user_id FROM users WHERE login = ?) AND blocked_by_user_id = (SELECT user_id FROM users WHERE login = ?)) OR (user_id = (SELECT user_id FROM users WHERE login = ?) AND blocked_by_user_id = (SELECT user_id FROM users WHERE login = ?)) LIMIT 1',
		[req.body.login, req.session.login, req.session.login, req.body.login], function (error, results) {
			if (error) throw error;
			if (!results[0]) {

				db.query('SELECT * ' +
				'FROM users ' +
				'INNER JOIN pictures ' +
				'ON pictures.pic_id = users.profile_pic ' +
				'WHERE login = ?',
				req.body.login, function (error, results, fields) {
					if (error) throw error;
					const infos = results[0];
					if (infos && infos.first_name && infos.last_name && infos.bio && infos.profile_pic && infos.birth_day && infos.birth_month && infos.birth_year && infos.location_lat && infos.location_lon) {
						profileInfos.login = results[0].login;
						profileInfos.first_name = results[0].first_name;
						profileInfos.last_name = results[0].last_name;
						profileInfos.bio = results[0].bio;
						profileInfos.gender = results[0].gender;
						profileInfos.profile_pic = results[0].img_url;
						profileInfos.birth_day = results[0].birth_day;
						profileInfos.birth_month = results[0].birth_month;
						profileInfos.birth_year = results[0].birth_year;
						profileInfos.user_location_lat = results[0].location_lat;
						profileInfos.user_location_lon = results[0].location_lon;
						profileInfos.last_seen = results[0].last_seen;
						db.query('SELECT img_url FROM pictures WHERE user_id = (SELECT user_id FROM users WHERE login = ?) AND pic_id != (SELECT profile_pic FROM users WHERE login = ?) LIMIT 4',
						[req.body.login, req.body.login], function (error, results, fields) {
							if (error) throw error;
							results.forEach(e => {
								pictures.push(e.img_url);
							})
							profileInfos.pictures = pictures;
							db.query('SELECT interest_name ' +
							'from interests ' +
							'inner join user_interests on user_interests.interest_id = interests.interest_id ' +
							'inner join users on users.user_id = user_interests.user_id ' +
							'where users.login = ?',
							req.body.login, function (error, results, fields) {
								if (error) throw error;
								results.forEach(e => {
									interests.push(e.interest_name);
								})
								profileInfos.interests = interests;
								db.query('SELECT location_lat, location_lon FROM users WHERE login = ?',
								req.session.login, function (error, results, fields) {
									if (error) throw error;
									if (results[0].location_lat && results[0].location_lon) {
										profileInfos.my_location_lat = results[0].location_lat;
										profileInfos.my_location_lon = results[0].location_lon;
										db.query('SELECT (SELECT COUNT(*) FROM views WHERE user_id = (SELECT user_id FROM users WHERE login = ?)) AS views, (SELECT COUNT(*) FROM likes WHERE user_id = (SELECT user_id FROM users WHERE login = ?)) AS likes;', [req.body.login, req.body.login], function (error, results) {
											if (error) throw error;
											profileInfos.popularity = results[0].views === 0 ? 1 : (results[0].likes / results[0].views) * 4 + 1;
											res.json({profileInfos: profileInfos});
										});
									} else {
										res.sendStatus(200);
									}
								});
							});
						});
					} else {
						res.sendStatus(200);
					}
				});
			} else {
				res.sendStatus(200);
			}
		});
		} else {
			res.sendStatus(200);
		}
	});

	module.exports = router;
