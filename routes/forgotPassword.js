const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
const bcrypt = require('bcrypt');

const router = express.Router();

const db = require('../src/db');
const transporter = require('../src/email');

router.post('/', function(req, res, next) {

	const post = req.body;

	if (!post.login) {
		res.json({errors:"Login is missing"});
	}
	else {
		db.query('SELECT email FROM users WHERE login = ? OR email = ? LIMIT 1', [post.login, post.login], function (error, result, fields) {
			if (error) throw error;
			if (!result[0]) {
				res.json({errors:"No user found"});
			}
			else {
				const newPassword = randomstring.generate(7);
				let mailOptions = {
					from: '"Jean Marc Morandini" <matcha42test@gmail.com>',
					to: result[0].email,
					subject: 'Matcha - Nouveau mot de passe',
					text: 'Voici ton nouveau mot de passe : ' + newPassword,
					html: '<b>Voici ton nouveau mot de passe : </b>' + newPassword
				};
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						return console.log(error);
					}
					bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(newPassword, salt, function(err, hash) {
							db.query('UPDATE users SET password = ? WHERE login = ? OR email = ?', [hash, post.login, post.login], function (error, results, fields) {
								if (error) throw error;
								res.sendStatus(202);
							});
						});
					});
				});
			}
		});
	}
});

module.exports = router;
