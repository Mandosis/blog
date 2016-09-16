"use strict";
require('angular2-universal-polyfills/node');
require('dotenv').config();
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var winston = require('winston');
var helmet = require('helmet');
var passport = require('passport');
var passportLocal = require('passport-local');
var setup_1 = require('./modules/setup');
var database_1 = require('./modules/database');
var user_1 = require('./models/user');
var router_1 = require('./routes/router');
var encrypt_1 = require('./modules/encrypt');
var core_1 = require('@angular/core');
var angular2_express_engine_1 = require('angular2-express-engine');
core_1.enableProdMode();
var app = express();
var ROOT = path.join(path.resolve(''));
var localStrategy = passportLocal.Strategy;
winston.addColors({
    debug: 'green',
    info: 'cyan',
    silly: 'magenta',
    warn: 'yellow',
    error: 'red'
});
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: process.env.LOG_LEVEL,
    colorize: true
});
database_1.Database.authenticate()
    .then(function () {
    winston.info('Successfully connected to database');
})
    .catch(function (err) {
    winston.error(err);
});
if (process.argv[2] == 'setup') {
    winston.remove(winston.transports.Console);
    setup_1.Setup.start();
}
app.engine('.html', angular2_express_engine_1.createEngine({}));
app.set('views', path.join(ROOT, '/public/views'));
app.set('view engine', 'html');
app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: ((60000 * 60) * 24) * 7, secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'username',
    passwordField: 'password'
}, function (req, email, password, done) {
    user_1.User
        .findOne({ where: { email: email } })
        .then(function (user) {
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        if (encrypt_1.ComparePassword(password, user.password)) {
            return done(null, user);
        }
        else {
            return done(null, false, { message: 'Incorrect username or password' });
        }
    })
        .catch(function (err) {
        done(err, false);
    });
}));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    user_1.User
        .findById(id)
        .then(function (user) {
        done(null, user);
    })
        .catch(function (err) {
        done(err, null);
    });
});
app.use(express.static(path.join(ROOT, 'public'), { index: false }));
app.use('/assets/js', express.static(path.join(ROOT, '/dist/client')));
app.use('/', router_1.Router);
var server = app.listen(process.env.PORT || 3000, function () {
    winston.info("Listening at http://localhost:" + server.address().port);
});
