const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const db = require('../src/db');

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		db.query('SELECT location_private FROM users WHERE login = ? LIMIT 1', req.session.login, function (error, results, fields) {
			if (error) throw error;
			if (results[0] && results[0].location_private === 0) {
				res.sendStatus(202);
			}
			else {
				res.sendStatus(200);
			}
		});
	}
	else {
		res.sendStatus(200);
	}
});

module.exports = router;
