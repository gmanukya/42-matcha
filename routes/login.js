const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const router = express.Router();

const db = require('../src/db');

router.post('/', function(req, res, next) {

	const post = req.body;

	if (!post.login || !post.password) {
		res.json({errors:"Some informations are missing"});
	}
	else {
		post.login = post.login.trim();
		db.query('SELECT login, password FROM users WHERE login = ? OR email = ? LIMIT 1', [post.login, post.login], function (error, result, fields) {
			if (error) throw error;
			if (!result[0]) {
				res.json({errors:"No user was found with that username"});
			}
			else {
				const userInfo = result[0];
				bcrypt.compare(post.password, userInfo.password, function(error, result) {
					if (error) throw error;
					if (result !== true) {
						res.json({errors:"The password is incorrect"});
					}
					else {
						req.session.login = userInfo.login;
						res.status(202).json({login: userInfo.login});
					}
				});
			}
		});
	}
});

module.exports = router;
