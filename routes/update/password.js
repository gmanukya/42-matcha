const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const router = express.Router();

const db = require('../../src/db');

router.post('/', function(req, res, next) {
	if (req.session && req.session.login) {
		var errorsArray = [];
		const post = req.body;
		if (!post.old || !post.new) {
			errorsArray.push("Please fill all fields");
		}
		if (post.new && post.new.length < 6) {
			errorsArray.push("Your password should be at least 6 characters long");
		}
		if (post.new && post.new.length > 20) {
			errorsArray.push("Maximum length for your password is 20 characters");
		}
		if (post.old && post.new) {
			db.query('SELECT password FROM users WHERE login = ?', req.session.login, function (error, results, fields) {
				if (error) throw error;
				bcrypt.compare(post.old, results[0].password, function(error, result) {
					if (error) throw error;
					if (result !== true) {
						errorsArray.push("The old password is incorrect");
					}
					if (errorsArray.length !== 0) {
						res.json({
							errors: errorsArray
						});
					}
					else {
						bcrypt.genSalt(10, function(err, salt) {
							bcrypt.hash(post.new, salt, function(err, hash) {
								console.log('ok');
								console.log(hash);
								db.query('UPDATE users SET password = ? WHERE login = ?', [hash, req.session.login], function (error, results, fields) {
									if (error) throw error;
									res.sendStatus(200);
								});
							});
						});
					}
				});
			});
		} else {
			res.sendStatus(200);
		}
	}
	else {
		res.sendStatus(200);
	}
});

module.exports = router;
