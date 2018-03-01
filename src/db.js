const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'matcha'
});

db.connect();
module.exports = db;
