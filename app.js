var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var redis = require('redis');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var config = require('./config');
var router = require('./router');

// require('events').EventEmitter.defaultMaxListeners = 15;

var app = express();

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

// send message middleware
app.use(flash());

// create Redis client
var redisClient = redis.createClient(config.redis.port, config.redis.address, {auth_pass: config.redis.auth});
// app use session
app.use(session({
  store: new redisStore({client: redisClient}),
  secret: config.session.secret, // recommand 128 bytes random string
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/admin',
    maxAge: config.session.maxAge
  }
}));

// load routes
router.init(app);

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

  if (err.status == 404) {
    res.render('404');
  } else {
    res.render('error');
  }
});

module.exports = app;
