import { Database } from '../modules/database';
import * as Sequelize from 'sequelize';

let User = Database.define('users', {
  email: { type: Sequelize.TEXT, allowNull: false, validate: { isEmail: true } },
  password: { type: Sequelize.TEXT, allowNull: false},
  name: { type: Sequelize.TEXT, allowNull: false }
});

User.sync();

export { User };
