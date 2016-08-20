import * as Sequelize from 'sequelize';

let database = new Sequelize(process.env.PG_CONNECTION_STRING, { logging: false });

export { database as Database };
