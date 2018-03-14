const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = require('../../src/db');

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		var notifications = [];

		db.query('SELECT notifications.notification_id, notifications.seen, notifications.type, users.login FROM notifications ' +
		'INNER JOIN users ON users.user_id = notifications.from_user_id ' +
		'WHERE notifications.user_id = (SELECT user_id FROM users WHERE login = ?) ' +
		'LIMIT 20',
		req.session.login, function (error, results, fields) {
			if (error) throw error;

				results.forEach(e => {
					notifications.push({id: e.notification_id, type: e.type, user: e.login, seen: (e.seen ? true : false), new: (e.seen ? false : true)});
				});
				res.json({"results": notifications.reverse()});
		});

	} else {
		res.sendStatus(200);
	}
});


module.exports = router;
