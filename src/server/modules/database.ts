import * as Sequelize from 'sequelize';

let database = new Sequelize(process.env.DATABASE_URL, { logging: false });

export { database as Database };
