const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	req.session.destroy(function(err) {
		res.sendStatus(200);
	})
});

module.exports = router;
