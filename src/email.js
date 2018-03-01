const express = require('express');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'matcha42test@gmail.com',
		pass: 'gornico42'
	}
});

module.exports = transporter;
