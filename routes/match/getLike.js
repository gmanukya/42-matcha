const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = require('../../src/db');

router.post('/', function(req, res, next) {
	if (req.session && req.session.login && req.body.login) {
		
		db.query('SELECT * ' +
		'FROM likes ' +
		'WHERE user_id = (SELECT user_id FROM users WHERE login = ?) ' +
		'AND liked_by_user_id = (SELECT user_id FROM users WHERE login = ?)',
		[req.body.login, req.session.login], function (error, results, fields) {
			if (error) throw error;

			if (results.length === 0) {
				
				db.query('SELECT * ' +
				'FROM likes ' +
				'WHERE user_id = (SELECT user_id FROM users WHERE login = ?) ' +
				'AND liked_by_user_id = (SELECT user_id FROM users WHERE login = ?)',
				[req.session.login, req.body.login], function (error, results, fields) {
					if (error) throw error;

					if (results.length) {
						res.json({liked: false, likedBy: true});
					} else {
						res.json({liked: false, likedBy: false});
					}

				});

			} else {

				db.query('SELECT * ' +
				'FROM likes ' +
				'WHERE user_id = (SELECT user_id FROM users WHERE login = ?) ' +
				'AND liked_by_user_id = (SELECT user_id FROM users WHERE login = ?)',
				[req.session.login, req.body.login], function (error, results, fields) {
					if (error) throw error;

					if (results.length) {
						res.json({liked: true, likedBy: true});
					} else {
						res.json({liked: true, likedBy: false});
					}

				});

			}
		});
		
	} else {
		res.sendStatus(200);
	}
});


module.exports = router;
