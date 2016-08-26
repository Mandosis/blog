import * as readline from 'readline';
import { EncryptPassword } from './encrypt';
import { User } from './models';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Setup {

  private _email: string;
  private _password: string;

  /**
   * Bootstrap Setup
   */
  start() {
    console.log(`
      Welcome!
    `);

    console.log(`Setup the admin account`);

    rl.question('Email: ', (answer) => {
      this._email = answer;

      rl.question('Password: ', (answer) => {
        this._password = answer;

        console.log(`Email: ${this._email}\nPassword: ${this._password}`);

        rl.close();
      });


      rl.close();
    });

  };

}


let setup = new Setup();


export { setup as Setup };
