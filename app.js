const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const config = require('./routes/config');
config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'matcha',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

app.use('/', require('./routes/index'));
app.use('/config', require('./routes/config'));
app.use('/signup', require('./routes/signup'));
app.use('/login', require('./routes/login'));
app.use('/auth', require('./routes/auth'));
app.use('/logout', require('./routes/logout'));
app.use('/forgotPassword', require('./routes/forgotPassword'));
app.use('/profile', require('./routes/profile'));
app.use('/update/first_name', require('./routes/update/first_name'));
app.use('/update/last_name', require('./routes/update/last_name'));
app.use('/update/email', require('./routes/update/email'));
app.use('/update/password', require('./routes/update/password'));
app.use('/update/birth_date', require('./routes/update/birth_date'));
app.use('/update/gender', require('./routes/update/gender'));
app.use('/update/sexual_orientation', require('./routes/update/sexual_orientation'));
app.use('/update/location', require('./routes/update/location'));
app.use('/update/interest', require('./routes/update/interest'));
app.use('/update/bio', require('./routes/update/bio'));

app.use('/isLocationPrivate', require('./routes/isLocationPrivate'));

app.use('/update/setProfilePic', require('./routes/update/setProfilePic'));
app.use('/update/upload', require('./routes/update/upload'));
app.use('/update/getUploaded', require('./routes/update/getUploaded'));
app.use('/update/deletePic', require('./routes/update/deletePic'));

app.use('/match/getProfileInfos', require('./routes/match/getProfileInfos'));
app.use('/match/getAllCompleteProfiles', require('./routes/match/getAllCompleteProfiles'));
app.use('/match/addProfileView', require('./routes/match/addProfileView'));
app.use('/match/likeProfile', require('./routes/match/likeProfile'));
app.use('/match/getLike', require('./routes/match/getLike'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
