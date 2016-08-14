import * as express from 'express';
import * as winston from 'winston';
import { User } from '../database';

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
  let user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name
  }, null);

  user.save()
    .then(() => {
      res.status(201).json({
        success: true,
        message: `User created successfully`
      });
    })
    .error((err) => {
      winston.error(err);
      res.status(500).json({
        success: false,
        message: `Internal error`
      })
    });
});

export { router as ApiRoutes };
