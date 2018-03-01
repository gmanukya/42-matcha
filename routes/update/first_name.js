const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = require('../../src/db');

router.post('/', function(req, res, next) {
	if (req.session && req.session.login) {
		const post = req.body;
		if (post.value && (/^[a-zà-ÿ ]+$/i).test(post.value)) {
			db.query('UPDATE users SET first_name = ? WHERE login = ?', [post.value.trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/\s+/, ' '), req.session.login], function (error, results, fields) {
				if (error) throw error;
				res.sendStatus(200);
			});
		}
	}
	else {
		res.sendStatus(200);
	}
});

module.exports = router;
