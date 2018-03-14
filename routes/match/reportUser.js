const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

const router = express.Router();

const db = require('../../src/db');
const transporter = require('../../src/email');

router.post('/', function(req, res, next) {
	const post = req.body;
	if (post.login) {
		let mailOptions = {
			from: '"Jean Marc Morandini" <matcha42test@gmail.com>',
			to: 'matcha42test@gmail.com',
			subject: 'Matcha - Reported user',
			text: 'This user has been reported user : ' + post.login,
			html: '<b>Reported user</b> : ' + post.login
		};
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) throw error
		});
	}
	res.sendStatus(202);
});

module.exports = router;
