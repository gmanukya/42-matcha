const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = require('../../src/db');

router.post('/', function(req, res, next) {
	if (req.session && req.session.login) {
		const post = req.body;
		if (post.action === 'delete') {
			db.query('DELETE FROM user_interests WHERE user_id = (SELECT user_id FROM users WHERE login = ?) AND interest_id = (SELECT interest_id FROM interests WHERE interest_name = ?)', [req.session.login, post.value],function (error, results, fields) {
				if (error) throw error;
				res.sendStatus(200);
			});
		}
		else {
			if (post.value && (/^[a-z]+$/gi).test(post.value)) {
				db.query('INSERT INTO interests SET interest_name = ? ON DUPLICATE KEY UPDATE interest_id=LAST_INSERT_ID(interest_id), interest_name = VALUES(interest_name)', post.value, function (error, results, fields) {
					if (error) throw error;
					db.query('INSERT INTO user_interests (user_id, interest_id) VALUES ((SELECT user_id FROM users WHERE login = ?), ?)', [req.session.login, results.insertId],function (error, results, fields) {
						if (error) throw error;
						res.sendStatus(200);
					});
				});
			} else {
				res.sendStatus(200);
			}
		}
	}
	else {
		res.sendStatus(200);
	}
});

module.exports = router;
