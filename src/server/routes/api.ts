import * as express from 'express';
import * as winston from 'winston';
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
