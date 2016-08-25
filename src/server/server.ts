// the polyfills must be the first thing imported in node.js
import 'angular2-universal/polyfills';

require('dotenv').config();

import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as winston from 'winston';
import * as helmet from 'helmet';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';

import { Setup } from './modules/setup';
import { Database } from './modules/database';
import { User } from './models/user';
import { Router } from './routes/router';
import { ComparePassword } from './modules/encrypt';

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { expressEngine } from 'angular2-universal';

// enable prod for faster renders
enableProdMode();

const app = express();
const ROOT = path.join(path.resolve(''));
const localStrategy = passportLocal.Strategy;

/*
 * Configure Winston
 */
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

/*
 * Check database connection
 * Info: See database.ts to configure settings
 */

Database.authenticate()
  .then(() => {
    winston.info('Successfully connected to database');
  })
  .catch((err) => {
    winston.error(err);
  })

/**
 * Run setup
 */
if (process.argv[2] == 'setup') {
  winston.remove(winston.transports.Console);
  Setup.start();
}


/*
 * Configure Express.js rendering engine
 */
app.engine('.html', expressEngine);
app.set('views', path.join(ROOT, '/public/views'));
app.set('view engine', 'html');

/*
 * Configure Middleware
 */
app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: ((60000 * 60) * 24) * 7, secure: false}
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Configure Passport Authentication
 */
passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'username',
  passwordField: 'password'
}, (req, email, password, done) => {

  User
    .findOne({ where: { email: email} })
    .then((user: any) => {

      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      if (ComparePassword(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect username or password' });
      }
    })
    .catch((err) => {
      done(err, false);
    });

}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User
    .findById(id)
    .then((user) => {
      done(null, user);
    })
    .error((err) => {
      done(err, null);
    });
})

/**
 * Set directories to serve static assets from
 */
app.use(express.static(path.join(ROOT, 'public'), {index: false}));
app.use('/assets/js', express.static(path.join(ROOT, '/dist/client')));

/*
 * Router
 */
app.use('/', Router);

/*
 * Server
 * Info: Runs on port 3000 if not set via environment variable
 */
let server = app.listen(process.env.PORT || 3000, () => {
  winston.info(`Listening at http://localhost:${server.address().port}`);
});
