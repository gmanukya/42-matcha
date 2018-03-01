const express = require('express');
var multer = require('multer');
const mysql = require('mysql');

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/public/uploads')
  },
  filename: function (req, file, cb) {
  	let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, req.session.login + Date.now() + '.' + extension);
  }
});

var upload = multer({ storage: storage });
const db = require('../../src/db');



router.post('/', upload.single('photo'), function(req, res, next) {
	if (!req.file) {
	    console.log("No file received");
	    return res.send({
	        success: false
	    });
  	} else {

  		const newPath = req.file.path.replace(/^client\/public\//g, '');
  		db.query('INSERT INTO pictures (user_id, img_url) ' +
  				 'VALUES ((SELECT user_id FROM users WHERE login = ?), ?)',
  			[req.session.login, newPath], function (error, results, fields) {
  				if (error) throw error;
          if (req.body.picCount == 0) {
            db.query('UPDATE users ' +
              'SET profile_pic = ' +
              '(SELECT pic_id FROM pictures WHERE img_url = ?) ' +
              'WHERE users.login = ?',
              [newPath, req.session.login], function (error, results, fields) {
                if (error) throw error;
                res.sendStatus(200);
              })
          } else {
  				  res.sendStatus(200);
          }
          
  		})
	}
});



module.exports = router;
