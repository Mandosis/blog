import { Database } from '../modules/database';
import { Encrypt, ComparePassword } from '../modules/encrypt';
import * as Sequelize from 'sequelize';

/**
 * User model
 */
let User = Database.define('users', {
  email: { type: Sequelize.TEXT, allowNull: false, validate: { isEmail: true } },
  password: { type: Sequelize.TEXT, allowNull: false},
  name: { type: Sequelize.TEXT, allowNull: false }
});

/**
 * Encrypt password before creating
 */
User.beforeCreate((user: any) => {
  return Encrypt(user.password).then((hash) => {
    user.password = hash;
  });
});

/**
 * Encrypt password if modified before save
 */
User.beforeUpdate((user: any) => {
  if (!user.changed('password')) {
    return;
  } else {
    return Encrypt(user.password).then((hash) => {
      user.password = hash;
    });
  }
});

/**
 * Create table
 */
User.sync();

export { User };
