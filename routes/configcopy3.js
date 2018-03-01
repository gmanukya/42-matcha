const express = require('express');
const mysql = require('mysql');
var faker = require('faker');
const bcrypt = require('bcrypt');

Array.prototype.unique = function() {
	return this.filter(function (value, index, self) {
		var count = 0;
		self.forEach(e => {
			if (e[0] === value[0]){
				count++;
			}
		});
		return count === 1;
	});
}

module.exports = function () {

	const connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
	});

	connection.connect();

					var pictures = [];
					for (var i = 1; i <= 101; i++) {
						var picRow = [];
						picRow.push(i);
						picRow.push(faker.image.people());
						pictures.push(picRow);
					}
					console.log(pictures);

					var users = [];
					for (var i = 0; i <= 100; i++) {
						var userRow = [];
						userRow.push(faker.internet.email());
						userRow.push(faker.name.firstName());
						userRow.push(faker.internet.userName());
						userRow.push(faker.name.lastName());
						var hash = bcrypt.hashSync("password", 10);
						userRow.push(hash);
						userRow.push(faker.address.latitude());
						userRow.push(faker.address.longitude());
						userRow.push(Math.floor(Math.random()));
						userRow.push(Math.floor(Math.random() * 2));
						userRow.push(Math.floor(Math.random() * 28) + 1);
						userRow.push(Math.floor(Math.random() * 11) + 1);
						userRow.push(Math.floor(Math.random() * 45) + 1973);
						userRow.push(i);
						userRow.push(Math.floor(Math.random() * 3));
						userRow.push(faker.lorem.sentence());
						userRow.push(0);
						users.push(userRow);
					}


					var interestsNotUnique = [];
					for (var i = 0; i < 50; i++) {
						var interestRow = [];
						interestRow.push(faker.random.word().toLowerCase().replace(/[- ]/g, '').substr(0, 12));
						interestsNotUnique.push(interestRow);
					}
					var interests = interestsNotUnique.unique();

					var uinterests = [];
					for (var i = 0; i <= 500; i++) {
						var uinterestRow = [];
						uinterestRow.push(Math.floor(Math.random() * 100) + 1);
						uinterestRow.push(Math.floor(Math.random() * interests.length) + 1);
						uinterests.push(uinterestRow);
					}

;	// connection.query('DROP DATABASE IF EXISTS matcha', function (error, results, fields) {
	//   if (error) throw error;
	connection.query('CREATE DATABASE IF NOT EXISTS matcha', function (error, results, fields) {
		if (error) throw error;
		connection.query('USE matcha', function (error, results, fields) {
			if (error) throw error;
			connection.query('CREATE TABLE IF NOT EXISTS users (' +
			'user_id INT AUTO_INCREMENT PRIMARY KEY,' +
			'email VARCHAR(80),' +
			'first_name VARCHAR(50),' +
			'login VARCHAR(32),' +
			'last_name VARCHAR(50),' +
			'password VARCHAR(255),' +
			'location_lat VARCHAR(255),' +
			'location_lon VARCHAR(255),' +
			'location_private INT DEFAULT 0,' +
			'gender INT DEFAULT 0,' +
			'birth_day INT DEFAULT 0,' +
			'birth_month INT DEFAULT 0,' +
			'birth_year INT DEFAULT 0,' +
			'profile_pic VARCHAR(255) DEFAULT NULL,' +
			'sexual_orientation INT DEFAULT 3,' +
			'bio VARCHAR(255) DEFAULT "",' +
			'popularity_score INT DEFAULT 0' +
			')', function (error, results, fields) {
				if (error) throw error;
				connection.query('CREATE TABLE IF NOT EXISTS likes (' +
				'like_id INT AUTO_INCREMENT PRIMARY KEY,' +
				'from_user_id INT NOT NULL,' +
				'to_user_id INT NOT NULL' +
				')', function (error, results, fields) {
					if (error) throw error;
					connection.query('CREATE TABLE IF NOT EXISTS interests (' +
					'interest_id INT AUTO_INCREMENT PRIMARY KEY,' +
					'interest_name VARCHAR(32) UNIQUE' +
					')', function (error, results, fields) {
						if (error) throw error;
						connection.query('CREATE TABLE IF NOT EXISTS user_interests (' +
						'user_id INT NOT NULL,' +
						'interest_id INT NOT NULL,' +
						'foreign key (user_id) references users (user_id),' +
						'foreign key (interest_id) references interests (interest_id)' +
						')', function (error, results, fields) {
							if (error) throw error;
							connection.query('CREATE TABLE IF NOT EXISTS messages (' +
							'msg_id INT NOT NULL PRIMARY KEY,' +
							'msg_chat_id INT NOT NULL,' +
							'msg_user_id INT NOT NULL,' +
							'msg_date DATETIME,' +
							'msg_text TEXT' +
							')', function (error, results, fields) {
								if (error) throw error;
								connection.query('CREATE TABLE IF NOT EXISTS pictures (' +
									'pic_id INT AUTO_INCREMENT PRIMARY KEY,' +
									'user_id INT NOT NULL,' +
									'img_url VARCHAR(255)' +
									')', function (error, results, fields) {
											if (error) throw error;

											connection.query('INSERT INTO pictures (user_id, img_url) ' +
											'VALUES ?',
											[pictures], function (error, results, fields) {
											if (error) throw error;
												connection.query('INSERT INTO users (email, first_name, login, last_name, password, location_lat, location_lon, location_private, gender, birth_day, birth_month, birth_year, profile_pic, sexual_orientation, bio, popularity_score) ' +
													'VALUES ?',
													[users], function (error, results, fields) {
														if (error) throw error;
														connection.query('INSERT INTO interests (interest_name) ' +
														'VALUES ?',
														[interests], function (error, results, fields) {
														if (error) throw error;
														connection.query('INSERT INTO user_interests (user_id, interest_id) ' +
															'VALUES ?',
															[uinterests], function (error, results, fields) {
																if (error) throw error;
														});
													});
												});
											});


								});
							});
						});
					});
				});
			});
		});
	});
	// });
}
