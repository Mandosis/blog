import { Database } from '../modules/database';
import { Encrypt } from '../modules/encrypt';
import * as Sequelize from 'sequelize';

let User = Database.define('users', {
  email: { type: Sequelize.TEXT, allowNull: false, validate: { isEmail: true } },
  password: { type: Sequelize.TEXT, allowNull: false},
  name: { type: Sequelize.TEXT, allowNull: false }
});

User.beforeCreate((user: any) => {
  return Encrypt(user.password)
    .then((hash) => {
      user.password = hash;
    });
});

User.sync();

export { User };
