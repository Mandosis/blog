import * as express from 'express';

let router = express.Router();

// Routes
router.get('/', (req,res) => {
  res.status(200).json({
    sucess: true,
    message: `Welcome to the blog api!`
  });
});

export { router as ApiRoutes };
