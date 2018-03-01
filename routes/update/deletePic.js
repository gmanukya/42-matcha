const express = require('express');
var fs = require('fs');
const mysql = require('mysql');

const db = require('../../src/db');
const router = express.Router();

router.post('/', function(req, res, next) {
	if (req.session && req.session.login) {
    db.query('DELETE FROM pictures ' +
 			 'WHERE img_url = ?',
  		req.body.url, function (error, results, fields) {
  			if (error) throw error;
  			req.body.url = './client/public/' + req.body.url;

        if (fs.existsSync(req.body.url)) {
    			fs.unlink(req.body.url, function (error) {
    				if (error) throw error;
    			});
        }
        
  	});

    if (req.body.isProfilePic === true) {
      db.query('UPDATE users SET profile_pic = NULL WHERE login = ?', req.session.login, function (error, results, fields) {
        if (error) throw error;
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(200);
    }

	} else {
    res.sendStatus(200);
  }
});

module.exports = router;
 