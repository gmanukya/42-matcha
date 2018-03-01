const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = require('../../src/db');

router.post('/', function(req, res, next) {
	if (req.session && req.session.login) {
		const post = req.body;
		db.query('UPDATE users SET gender = ? WHERE login = ?', [post.value, req.session.login], function (error, results, fields) {
			if (error) throw error;
			res.sendStatus(200);
		});
	}
	else {
		res.sendStatus(200);
	}
});

module.exports = router;
