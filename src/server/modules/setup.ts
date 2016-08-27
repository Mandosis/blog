import { EncryptPassword } from './encrypt';
import { User } from './models';

const prompt = require('prompt');

let questions = {
  properties: {
    name: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      description: 'Name displayed on blog posts',
      required: true
    },
    email: {
      name: 'email',
      description: 'Admin email address',
      format: 'email',
      message: 'Must be a valid email address'
    },
    password: {
      description: 'Admin password',
      hidden: true,
      required: true
    },
    confirmPassword: {
      description: 'Confirm password',
      hidden: true,
      required: true
    }
  }
}

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

    console.log(`Account creation`);

    prompt.start();
    prompt.message = '';
  	prompt.delimiter = ':';

    prompt.get(questions, (err, result) => {
      console.log(result);
    })
  };

  

}


let setup = new Setup();


export { setup as Setup };
