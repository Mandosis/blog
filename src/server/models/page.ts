import { Database } from '../modules/database';
import { User } from './user';
import * as sequelize from 'sequelize';

let Page = Database.define('pages', {
  title: sequelize.TEXT,
  body: sequelize.TEXT,
  url: sequelize.TEXT
});

Page.sync();

export { Page };
