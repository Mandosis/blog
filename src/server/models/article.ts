import { Database } from '../modules/database';
import { User } from './user';
import { Tag } from './tag';
import * as Sequelize from 'sequelize';

let Article = Database.define('articles', {
  title: { type: Sequelize.TEXT, allowNull: false },
  body: { type: Sequelize.TEXT, allowNull: false},
  cover: { type: Sequelize.TEXT },
  url: { type: Sequelize.TEXT, allowNull: false }
});

Article.sync();

export { Article };
