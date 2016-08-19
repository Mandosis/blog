import * as express from 'express';
import { ngApp } from './ngApp';
import { ApiRoutes } from './api';


var router: any = express.Router();

// Put API routes here
router.use('/v1', ApiRoutes);

/*
 * Catch all for client side rendering
 * Warning: Must be the last route!
 */

router.get('/*', ngApp);
// router.get('/dashboard', ngApp);
// router.get('/dashboard/*', ngApp);

export { router as Router };
