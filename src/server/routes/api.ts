import * as express from 'express';
import * as winston from 'winston';
import * as passport from 'passport';
import { User } from '../models/user';
import { Article } from '../models/article';

let router = express.Router();

/**
 * API Introduction
 */
router.get('/', (req,res) => {

  res.status(200).json({
    sucess: true,
    message: `Welcome to the blog api!`
  });
});

/**
 * Authenticate Users
 */
router.get('/auth', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      success: true,
      message: 'User authenticated',
      data: req.user
    })
  } else {
    res.status(200).json({
      success: false,
      message: 'User not authenticated'
    })
  }
});

router.post('/auth', passport.authenticate('local', { session: true }), (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: 'User authenticated'
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'Username or password incorrect'
      });
    }
});




/**
 * Protected Routes
 * Description: A user must be logged in to access the below routes
 */
router.use((req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  } else {
    next();
  }
});

router.get('/users', (req, res) => {
  res.status(200).json({
    message: 'Well hello there!'
  })
})

/**
 * Create a new user
 */
router.post('/users', (req, res) => {
  User
    .create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    })
    .then(() => {
      res.status(201).json({
        success: true,
        message: 'User created successfully'
      })
    })
    .catch((err) => {
      winston.error(err);
      res.status(500).json({
        success: false,
        message: 'Internal error'
      })
    });
});

/**
 * Create an article
 */
router.post('/articles', (req, res) => {
  Article
    .create({
      title: req.body.title,
      body: req.body.body,
      cover: req.body.cover,
      url: req.body.url
    })
    .then(() => {
      res.status(201).json({
        success: true,
        message: 'Article created successfully'
      })
    })
    .catch((err) => {
      winston.error(err);
      res.status(500).json({
        success: false,
        message: 'Internal error'
      })
    });
});



export { router as ApiRoutes };
