import * as winston from 'winston';
import * as pg from 'pg';

export const ConnectionString: string = process.env.DB_CONNECTION_STRING || 'postgres://localhost:5432/blog';

export function InitializeDatabase(connection: string): void {
  pg.connect(connection, (err, client, done) => {
    if (err) {
      winston.error(err.toString());
    } else {
      // create schema if it does not exist
      const userTable: string = `CREATE TABLE IF NOT EXISTS users(
        id serial PRIMARY KEY,
        email text NOT NULL,
        password text NOT NULL,
        first_name text NOT NULL,
        last_name text NOT NULL
      );`;

      const articlesTable: string = `CREATE TABLE IF NOT EXISTS articles(
        id serial PRIMARY KEY,
        title text NOT NULL,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        body text NOT NULL,
        tags integer[],
        cover_img text,
        url text NOT NULL,
        author_id integer NOT NULL
      );`;

      const pagesTable: string = `CREATE TABLE IF NOT EXISTS pages(
        id serial PRIMARY KEY,
        title text NOT NULL,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        body text NOT NULL,
        url text NOT NULL,
        author_id integer NOT NULL
      );`;

      const tagsTable: string = `CREATE TABLE IF NOT EXISTS tags(
        id serial PRIMARY KEY,
        name text NOT NULL,
        articles integer[]
      );`;

      let query = client.query(userTable + articlesTable + pagesTable + tagsTable);

      query.on('end', () => {
        winston.info('Successfully created schmea');
        done();
      });

      query.on('error', (err) => {
        winston.error(err.toString());
        process.exit(1);
      });
    }
  })
}
