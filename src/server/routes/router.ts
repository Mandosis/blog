import * as express from 'express';
import { ngApp } from './ngApp';

var router: any = express.Router();

// Put API routes here

/*
 * Catch all for client side rendering
 * Warning: Must be the last route!
 */
router.get('/*', ngApp);

export { router as Router };
