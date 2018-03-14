const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = require('../../src/db');

router.post('/', function(req, res, next) {
	if (req.session && req.session.login && req.body.contact) {

		db.query('SELECT * ' +
		'FROM messages ' +
		'WHERE (user_id = (SELECT user_id FROM users WHERE login = ?) ' +
		'AND to_user_id = (SELECT user_id FROM users WHERE login = ?)) ' +
		'OR (user_id = (SELECT user_id FROM users WHERE login = ?) ' +
		'AND to_user_id = (SELECT user_id FROM users WHERE login = ?)) ',
		[req.session.login, req.body.contact, req.body.contact, req.session.login], function (error, results, fields) {
			if (error) throw error;

			var messages = [];
			if (results.length) {
				db.query('SELECT user_id FROM users WHERE login = ?', req.session.login, function (err, resu) {
					if (err) throw err;

					if (resu[0]) {
						const myId = resu[0].user_id;

						results.forEach((e) => {
							if (e.user_id === myId) {
								messages.push({'login': req.session.login, 'message': e.msg_text, 'date': e.msg_date});
							} else {
								messages.push({'login': req.body.contact, 'message': e.msg_text, 'date': e.msg_date})
							}
						});

						res.json({'messages': messages});

					} else {
						res.sendStatus(200);
					}
				});

			} else {
				res.sendStatus(200);
			}
		});

	} else {
		res.sendStatus(200);
	}
});


module.exports = router;
