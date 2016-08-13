import * as winston from 'winston';
import * as Promise from 'bluebird';
import * as pg from 'pg';

import { EncryptPassword, ComparePassword } from './modules/encrypt';

let uri: string = process.env.DB_CONNECTION_STRING || 'postgres://localhost:5432/blog';

/**
 * Database URI
 */

export const ConnectionString: string = uri;


/**
 * Check connection to database and create tables if they do not exist.
 */

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
        name text NOT NULL
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
        winston.info('Successfully ensured schema exists');
        done();
      });

      query.on('error', (err) => {
        winston.error(err.toString());
        process.exit(1);
      });
    }
  })
};

/**
 * Create a new user
 * Params: Accepts object containing username, password,
 */

 export class User {

   user = {
     id: '',
     email: '',
     password: '',
     name: '',
     stored_id: '',
     stored_email: '',
     stored_password: '',
     stored_name: ''

   };

   constructor (user) {
     this.user.email = user.email;
     this.user.password = user.password;
     this.user.name = user.name;
     this.user.id = user.stored_id || '';
     this.user.stored_id = user.stored_id || '';
     this.user.stored_email = user.stored_email || '';
     this.user.stored_password = user.stored_password || '';
     this.user.stored_name = user.stored_name || '';
   };

   save() {
     let user = this.user;

     /**
      * Check if password was updated for password encryption
      */
     if (user.stored_password == '' || user.stored_password != user.password) {
       user.password = EncryptPassword(user.password);
     }

     if (user.stored_id == '') {

       // Create new user
       return new Promise((resolve, reject) => {
         pg.connect(uri, (err, client) => {
           if (err) {
             reject(err);
           } else {
             let query = client.query(`INSERT INTO users(email, password, name) VALUES ($1, $2, $3)`, [ user.email, user.password, user.name]);

             query.on('error', (err) => {
               reject(err);
             });

             query.on('end', () => {
               resolve();
             })
           }
         });
       });

     } else {
       // Update user

       return new Promise((resolve, reject) => {
         pg.connect(uri, (err, client) => {
           if (err) {
             reject(err);
           } else {
             let query = client.query(`
               UPDATE users
               SET email = $1,
                password = $2,
                name = $3
               WHERE
                id = $4;`, [ user.email, user.password, user.name, user.id ]);

             query.on('error', (err) => {
               reject(err);
             });

             query.on('end', () => {
               resolve();
             })
           }
         });
       });

     }
   }
 };

/**
 * Check if something exists
 * Example: exists('users', 'email', 'example@example.com').then().error();
 */
 function exists(table: string, column: string, row: string) {
   return new Promise((resolve, reject) => {
     pg.connect(uri, (err, client) => {
       if (err) {
         reject(err);
       } else {
         let query = client.query(`SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column}=$1;`, [row], (err, result) => {
           if (err) {
             reject(err);
           } else {
             resolve(result);
           }

           client.end();
         });
       }
     })
   });
 };
