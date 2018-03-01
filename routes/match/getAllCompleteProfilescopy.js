var moment = require('moment');
const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = require('../../src/db');
const Geolocator = require('../../client/src/modules/Geolocator');


router.get('/', function(req, res, next) {

	if (req.session && req.session.login) {

		db.query('SELECT * FROM users ' +
		'INNER JOIN pictures ' +
		'ON pictures.pic_id = users.profile_pic ' +
		'WHERE email IS NOT NULL AND ' +
		'first_name IS NOT NULL AND ' +
		'last_name IS NOT NULL AND ' +
		'location_lat IS NOT NULL AND ' +
		'location_lon IS NOT NULL AND ' +
		'gender != 0 AND ' +
		'birth_day IS NOT NULL AND ' +
		'birth_month IS NOT NULL AND ' +
		'birth_year IS NOT NULL AND ' +
		'profile_pic IS NOT NULL AND ' +
		'sexual_orientation != 0 AND ' +
		'bio IS NOT NULL AND ' +
		'bio != "" ',
		req.session.login, function (error, results, fields) {
			if (error) throw error;

			if (results) {
				var resu = [];
				var my_location_lat;
				var my_location_lon;

				for (var key in results) {
					if (results[key].login === req.session.login) {
						my_location_lat = results[key].location_lat;
						my_location_lon = results[key].location_lon;
						results.splice(key, 1);
						break;
					}
				}

				if (my_location_lat && my_location_lon) {
					for (var key in results) {
						Geolocator.calcDistance(
							my_location_lat,
							my_location_lon,
							results[key].location_lat,
							results[key].location_lon,
							(distance) => {
								var age = moment().diff(moment(results[key].birth_year + '/' + results[key].birth_month + '/' + results[key].birth_day, "YYYY-MM-DD"), 'years');
								if (age > 17) {
									resu.push({
										login: results[key].login,
										profilePic: results[key].img_url,
										first_name: results[key].first_name,
										age: age,
										gender: results[key].gender,
										distance: parseInt(distance, 10)
									});
								}
							}
						);
					}
					console.log()
					res.json({results: resu});
				} else {
					res.sendStatus(200);
				}

			} else {
				res.sendStatus(200);
			}

		});


	} else {
		res.sendStatus(200);
	}
});


module.exports = router;
