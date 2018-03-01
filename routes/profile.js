const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = require('../src/db');

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		db.query('SELECT * FROM users WHERE login = ? LIMIT 1', [req.session.login], function (error, results, fields) {
			if (error) throw error;
			const sexual_orientation = results[0].sexual_orientation === 0 ? [""] : results[0].sexual_orientation === 1 ? ["M"] : results[0].sexual_orientation === 2 ? ["F"] : ["M", "F"];
			const gender = results[0].gender === 1 ? "M" : results[0].gender === 2 ? "F" : "";
			const userInfo = {
				first_name: results[0].first_name,
				last_name: results[0].last_name,
				email: results[0].email,
				birth_date: {
					day: results[0].birth_day,
					month: results[0].birth_month,
					year: results[0].birth_year
				},
				location: {
					address: "",
					latitude: results[0].location_lat,
					longitude: results[0].location_lon,
					private: results[0].location_private
				},
				gender: gender,
				sexual_orientation: sexual_orientation,
				bio: results[0].bio
			};
			db.query('SELECT interest_name FROM interests INNER JOIN user_interests ON user_interests.interest_id = interests.interest_id WHERE user_interests.user_id = (SELECT user_id FROM users WHERE login = ?)', [req.session.login], function (error, results, fields) {
				if (error) throw error;
				userInfo.interests = results.map(r => r.interest_name);
				res.json(userInfo);
			});
		});
	}
	else {
		res.sendStatus(200);
	}
});

module.exports = router;
