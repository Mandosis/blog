import * as winston from 'winston';
import * as Promise from 'bluebird';
import * as pg from 'pg';

import { EncryptPassword, ComparePassword } from './encrypt';

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
 * Create or access user information
 */

 export class User {

   findOne: (obj: any) => Promise<any>;
   save: () => Promise<any>;

   id: number;
   email: string;
   password: string;
   name: string;

   private _isSavedToDatabase: boolean;
   private _id: number;
   private _email: string;
   private _password: string;
   private _name: string;

   constructor (user?: any, db?: boolean) {

     if (db) {

       this._isSavedToDatabase = true;

       // Database Value
       this._id = user.id;
       this._email = user.email;
       this._password = user.password;
       this._name = user.name;

       // User accessable values
       this.id = user.id;
       this.email = user.email;
       this.password = user.password;
       this.name = user.name;

       // Add method to save user
       this.save = this._save;

     } else if (user) {

       // Set user accessable values
       this.email = user.email;
       this.password = user.password;
       this.name = user.name;

       // Add method to save user
       this.save = this._save;
     } else {

       // Since there is no user info, add the findOne method
       this.findOne = this._findOne;
     }
   };



   /**
    * Used to save a new user or update their information.
    * Returns a Promise
    */
   private _save() {

     /**
      * Check if password was updated for password encryption
      */
     if (this._password == null || this._password != this.password) {
       this.password = EncryptPassword(this.password);
     }

     if (!this._isSavedToDatabase) {

       // Create new user
       return new Promise((resolve, reject) => {
         pg.connect(uri, (err, client) => {
           if (err) {
             reject(err);
           } else {

             let query = client.query(`INSERT INTO users(email, password, name) VALUES ($1, $2, $3)`, [
               this.email,
               this.password,
               this.name
             ]);

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
                id = $4;`, [
                  this.email,
                  this.password,
                  this.name,
                  this.id
                ]);

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
   } // End of save()



   /**
    * Find a user
    */
    private _findOne(input) {

      return new Promise((resolve, reject) => {

        // Check if more than one key was supplied
        if (this._getObjectSize(input) > 1) {
          reject('More than one key supplied');
        } else {

          // Get name of key
          let key: string = Object.keys(input)[0];
          let value: string = input[key];
          let results: Array<any> = [];

          pg.connect(uri, (err, client) => {
            if (err) {
              reject(err);
            }

            let query = client.query(`
              SELECT
                *
              FROM
                users
              WHERE
                ${key} = $1`, [ value ]);

            query.on('error', (err) => {
              reject(err);
            });

            query.on('row', (row) => {
              results.push(row);
            });

            query.on('end', () => {
              resolve(results);
            });
          });
        }

      });
    } // End of findOne

    /**
     * Count the number of keys in an object
     */
    private _getObjectSize(obj) {
      let size = 0, key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          size++;
        }
      }
      return size;
    };

 };






 /**
  * Create and access articles
  */
export class Article {

  findOne: (obj) => Promise<any>;
  save: () => Promise<any>;

  id: number;
  title: string;
  date: Date;
  body: string;
  tags: Array<number>;
  cover_img: string;
  url: string;
  author_id: number;

  private _isSavedToDatabase: boolean;
  private _id: number;
  private _title: string;
  private _date: Date;
  private _body: string;
  private _tags: Array<number>;
  private _cover_img: string;
  private _url: string;
  private _author_id: number;


  constructor (article?: any, db?: boolean) {
    if (db) {

      this._isSavedToDatabase = true;

      // Private
      this._id = article.id;
      this._title = article.title;
      this._date = article.date;
      this._body = article.body;
      this._tags = article.tags;
      this._cover_img = article.cover_img;
      this._url = article.url;
      this._author_id = article.author.id;

      // Public
      this.id = article.id;
      this.title = article.title;
      this.date = article.date;
      this.body = article.body;
      this.tags = article.tags;
      this.cover_img = article.cover_img;
      this.url = article.url;
      this.author_id = article.author.id;

      // Add save method
      this.save = this._save;

    } else if (article) {

      // Public
      this.id = article.id;
      this.title = article.title;
      this.date = article.date;
      this.body = article.body;
      this.tags = article.tags;
      this.cover_img = article.cover_img;
      this.author_id = article.author.id;

      // Add save method
      this.save = this._save;

    } else {

      // this.findOne = this._findOne();
    }
  }

  private _save() {

    if (!this._isSavedToDatabase) {
      return new Promise((resolve, reject) => {
        pg.connect(uri, (err, client) => {
          if (err) {
            reject(err);
          } else {
            let query = client.query(`
              INSERT INTO articles(
                title,
                date,
                body,
                tags,
                cover_img,
                url,
                author_id
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                this.title,
                this.date,
                this.body,
                this.tags,
                this.cover_img,
                this.url,
                this.author_id
            ]);

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
      return new Promise((resolve, reject) => {
        pg.connect(uri, (err, client) => {
          if (err) {
            reject(err);
          } else {
            let query = client.query(`
              UPDATE
               articles
              SET
               title = $1,
               body = $2,
               tags = $3,
               cover_img = $4,
               url = $5,
              WHERE
               id = $6;`, [
                 this.title,
                 this.body,
                 this.tags,
                 this.cover_img,
                 this.url
               ]);

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
  };
};
