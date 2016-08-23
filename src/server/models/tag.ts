import { Database } from '../modules/database';
import * as sequelize from 'sequelize';

let Tag = Database.define('tags', {
  title: sequelize.TEXT,
  description: sequelize.TEXT
});

Tag.sync();

export { Tag };
