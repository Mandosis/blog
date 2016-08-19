import * as express from 'express';
import * as winston from 'winston';
import { User, Article, FindOne } from '../modules/database';

let router = express.Router();
let findOne = new FindOne();

/**
 * API Introduction
 */
router.get('/', (req,res) => {
  findOne.user({ email: 'test@test.com' })
    .then((results) => {
      winston.debug(results);
    })
    .error((err) => {
      winston.error(err);
    });

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

router.post('/articles', (req, res) => {
  let article = new Article({
    title: req.body.title,
    date: new Date(),
    body: req.body.body,
    tags: req.body.tags,
    cover_img: req.body.cover_img,
    url: req.body.url,
    author_id: req.body.author_id
    // author_id: req.user.id
    // TODO switch when authentication is working.
  });

  article.save()
    .then(() => {
      res.status(201).json({
        success: true,
        message: 'Article successfully saved.'
      });
    })
    .error((err) => {
      res.status(500).json({
        success: false,
        message: `Internal error`
      });
    });
});

export { router as ApiRoutes };
