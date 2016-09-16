import { MainModule } from '../../client/main';


export function ngApp(req, res, next) {
  res.render('index', {
    req,
    res,
    ngModule: MainModule,
    originalUrl: req.hostname,
    baseUrl: '/',
    requestUrl: req.originalUrl,
    preboot: false
  });
}
