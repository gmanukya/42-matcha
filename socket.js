const mysql = require('mysql');

const db = require('./src/db');

var connectedUser = {};

exports = module.exports = io => {

	io.sockets.on('connect', socket => {

		socket.on('login', login => {
			connectedUser[login] = socket.id;
			io.sockets.emit('connectedUser', connectedUser);
		});

		socket.on('message', function (data) {
			const login = Object.keys(connectedUser).find(key => connectedUser[key] === socket.id);
			const toUserId = connectedUser[data.toUser];

			db.query('SELECT * FROM blocked_users ' +
			'WHERE user_id = (SELECT user_id FROM users WHERE login = ?) ' +
			'AND blocked_by_user_id = (SELECT user_id FROM users WHERE login = ?)',
			[login, data.toUser], function (error, results, fields) {

				if (error) throw error;
				if (results.length === 0) {
					db.query('INSERT INTO messages ' +
					'SET msg_date = CURRENT_TIMESTAMP, ' +
					'user_id = (SELECT user_id FROM users WHERE login = ?), ' +
					'to_user_id = (SELECT user_id FROM users WHERE login = ?), ' +
					'msg_text = ?',
					[login, data.toUser, data.message], function (error, results, fields) {

						if (error) throw error;
						db.query('DELETE FROM notifications WHERE user_id = (SELECT user_id FROM users WHERE login = ?) AND from_user_id = (SELECT user_id FROM users WHERE login = ?) AND type = 0;' +
						'INSERT INTO notifications ' +
						'SET user_id = (SELECT user_id FROM users WHERE login = ?), ' +
						'from_user_id = (SELECT user_id FROM users WHERE login = ?)',
						[data.toUser, login, data.toUser, login], function (error, results, fields) {

							if (error) throw error;
							socket.to(toUserId).emit('message', {'login': login, 'message': data.message});
							socket.to(toUserId).emit('messageNotif', {'notifId': results[1].insertId, 'notifType': 0, 'login': login});

						});
					});
				}
			});
		});

		socket.on('like', data => {
			const login = Object.keys(connectedUser).find(key => connectedUser[key] === socket.id);
			const toUserId = connectedUser[data.login];

			db.query('SELECT * FROM blocked_users ' +
			'WHERE user_id = (SELECT user_id FROM users WHERE login = ?) ' +
			'AND blocked_by_user_id = (SELECT user_id FROM users WHERE login = ?)',
			[login, data.toUser], function (error, results, fields) {

				if (error) throw error;
				if (results.length === 0) {
					if (data.liked) {
						db.query('DELETE FROM notifications WHERE user_id = (SELECT user_id FROM users WHERE login = ?) AND from_user_id = (SELECT user_id FROM users WHERE login = ?) AND type = 1;' +
						'INSERT INTO notifications SET user_id = (SELECT user_id FROM users WHERE login = ?), from_user_id = (SELECT user_id FROM users WHERE login = ?), type = 1',
						[data.login, login, data.login, login], function (error, results, fields) {
							if (error) throw error;
							socket.to(toUserId).emit('like', {notifId: results[1].insertId, notifType: 1, login: login, liked: data.liked});
						});
					}

					else {
						socket.to(toUserId).emit('like', {login: login, liked: data.liked});
					}
				}

			});
		});

		socket.on('disconnect', () => {
			const login = Object.keys(connectedUser).find(key => connectedUser[key] === socket.id);
			db.query('UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE login = ?', [login], function (error, results, fields) {
				if (error) throw error;
				delete connectedUser[login];
				setTimeout(() => io.sockets.emit('connectedUser', connectedUser), 2000);
			});
		});
	});
}
