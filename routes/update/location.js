const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const db = require('../../src/db');

router.post('/', function(req, res, next) {
	if (req.session && req.session.login) {
		const post = req.body;
		if (!post.private) post.private = 0;
		db.query('UPDATE users SET location_lat = ?, location_lon = ?, location_private = ? WHERE login = ?', [post.latitude, post.longitude, post.private, req.session.login], function (error, results, fields) {
			if (error) throw error;
			res.sendStatus(200);
		});
	}
	else {
		res.sendStatus(200);
	}
});

module.exports = router;
