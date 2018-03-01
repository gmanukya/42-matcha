const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = require('../../src/db');

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		db.query('SELECT img_url ' +
		'FROM pictures ' +
		'WHERE pictures.user_id = (SELECT user_id FROM users WHERE login = ?) LIMIT 5',
		req.session.login, function (error, results, fields) {
			if (error) throw error;
			var urls = [];
			results.forEach((e) => {
				urls.push(e.img_url)
			});
			db.query('SELECT img_url ' +
			'FROM pictures ' +
			'WHERE pictures.pic_id = (SELECT profile_pic FROM users WHERE login = ?)',
			req.session.login, function (error, results, fields) {
				if (error) throw error;
				if (results.length !== 0) {
					res.json({ profilePic: results[0].img_url, urls: urls });
				} else {
					res.json({ urls: urls });
				}
			});
		});
	} else {
		res.sendStatus(200);
	}
});


module.exports = router;
