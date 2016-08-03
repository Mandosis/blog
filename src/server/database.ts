import * as mongoose from 'mongoose';
import * as winston from 'winston';

export function Connect() {
  let MongoDB = mongoose.connect('mongodb://localhost/2MEAN').connection;

  MongoDB.on('open', () => {
    winston.info('Connected to database');
  });

  MongoDB.on('error', (err) => {
    winston.error('Error connecting to database: ' + err);
  });

}
