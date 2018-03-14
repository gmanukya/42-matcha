const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = require('../../src/db');

router.post('/', function(req, res, next) {
	var errorsArray = [];
	if (req.session && req.session.login) {
		const post = req.body;
		if (post.value || !(/^.+@.+\..+$/.test(post.value))) {
			res.json({errors:"This email is not valid"});
		}
		else {
			db.query('SELECT login FROM users WHERE email = ? LIMIT 1', post.value, function (error, results, fields) {
				if (error) throw error;
				if (results[0] && results[0].login !== req.session.login) {
					res.json({errors:"This email is already taken"});
				}
				else {
					db.query('UPDATE users SET email = ? WHERE login = ?', [post.value.trim(), req.session.login], function (error, results, fields) {
						if (error) throw error;
						res.sendStatus(200);
					});
				}
			});
		}
	}
	else {
		res.sendStatus(200);
	}
});

module.exports = router;
