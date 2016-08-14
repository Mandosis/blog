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

   user: any = {};
   private saved: any = {};

   constructor (user: any, saved: any) {

     if (saved.id != null || saved.id != '') {
       this.saved = saved;
       this.user = saved;
     } else {
       this.user = user;
     }
   };

   /**
    * Used to save a new user or update their information.
    * Returns a Promise
    */
   save() {
     let user = this.user;
     let saved = this.saved;

     /**
      * Check if password was updated for password encryption
      */
     if (saved.password == null || saved.password != user.password) {
       user.password = EncryptPassword(user.password);
     }

     if (saved.id == '') {

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
