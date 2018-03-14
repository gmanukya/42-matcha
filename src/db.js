const express = require('express');
const mysql = require('mysql');

var db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'matcha',
	multipleStatements: true
});

db.connect();
module.exports = db;
