const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = require('../../src/db');

router.post('/', function(req, res, next) {
	if (req.session && req.session.login && req.body.login) {
		console.log('matcha mmmaaaaagggggglllle');
		db.query('SELECT * ' +
		'FROM blocked_users ' +
		'WHERE user_id = (SELECT user_id FROM users WHERE login = ?) ' +
		'AND blocked_by_user_id = (SELECT user_id FROM users WHERE login = ?)',
		[req.body.login, req.session.login], function (error, results, fields) {
			if (error) throw error;

			if (results.length === 0) {
				db.query('INSERT INTO blocked_users ' +
				'SET user_id = (SELECT user_id FROM users WHERE login = ?), ' +
				'blocked_by_user_id = (SELECT user_id FROM users WHERE login = ?)',
				[req.body.login, req.session.login], function (error, results, fields) {
					if (error) throw error;
				});
			}
			res.sendStatus(200);
		});
		
	} else {
		res.sendStatus(200);
	}
});


module.exports = router;
