const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const db = require('../src/db');

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		db.query('SELECT * FROM users WHERE login = ? LIMIT 1', req.session.login, function (error, results, fields) {
			if (error) throw error;
			if (results[0].profile_pic && results[0].first_name && results[0].last_name && results[0].email && results[0].birth_day && results[0].birth_month && results[0].birth_year && results[0].gender && results[0].sexual_orientation && results[0].location_lat && results[0].location_lon && results[0].bio) {
				res.json({
					login: req.session.login,
					profile: true,
					birth_date: {
						day: results[0].birth_day,
						month: results[0].birth_month,
						year: results[0].birth_year
					}
				});
			}
			else {
				res.json({
					login: req.session.login
				});
			}
		});
	}
	else {
		res.json({login: ""});
	}
});

module.exports = router;
