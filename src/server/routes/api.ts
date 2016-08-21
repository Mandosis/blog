import * as express from 'express';
import * as winston from 'winston';
import * as passport from 'passport';
import { User } from '../models/user';
import { Article } from '../models/article';
import { EncryptPassword } from '../modules/encrypt';

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
      password: EncryptPassword(req.body.password),
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

router.post('/articles', (req, res) => {
});


export { router as ApiRoutes };
