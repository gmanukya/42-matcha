const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = require('../../src/db');


router.post('/', function(req, res, next) {
	if (req.session && req.session.login && req.body.id) {
		db.query('UPDATE notifications SET seen = 1 WHERE notification_id = ?',
		req.body.id, function (error, results, fields) {
			if (error) throw error;
		});
	}
	res.sendStatus(200);
});


module.exports = router;
