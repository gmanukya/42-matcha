const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = require('../../src/db');


router.post('/', function(req, res, next) {
	if (req.session && req.session.login) {
		db.query('UPDATE users ' +
		'SET profile_pic = ' +
		'(SELECT pic_id FROM pictures WHERE img_url = ? AND user_id = (SELECT user_id FROM (SELECT * FROM users) as users WHERE login = ?)) ' +
		'WHERE users.login = ?',
		[req.body.url, req.session.login, req.session.login], function (error, results, fields) {
			if (error) throw error;
			res.sendStatus(200);
		})
	}
});



module.exports = router;
