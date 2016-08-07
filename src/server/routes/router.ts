import * as express from 'express';
import { ngApp } from './ngApp';

var router: any = express.Router();

// Put API routes here

/*
 * Catch all for client side rendering
 * Warning: Must be the last route!
 */
router.get('/', ngApp);
router.get('/dashboard', ngApp);
router.get('/dashboard/*', ngApp);

export { router as Router };
