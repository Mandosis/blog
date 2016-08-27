import { User } from './models';

const prompt = require('prompt');

class Setup {

  private _email: string;
  private _password: string;

  private _questions = {
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
      }
    }
  };

  /**
   * Bootstrap Setup
   */
  start() {

    this._printIntro();
    this._askQuestions();

  };

  private _printIntro(): void {
    console.log(`Setup`);
  }

  private _askQuestions() {
    console.log(`Account creation`);

    prompt.start();
    prompt.message = '';
    prompt.delimiter = ':';

    prompt.get(this._questions, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this._createUser(result.email, result.password, result.name);
      }
    });
  }

  private _createUser(email, password, name) {
    User
      .create({
        email: email,
        password: password,
        name: name
      })
      .then(() => {
        console.log('Admin user created successfully.');
        process.exit();
      })
      .catch((err) => {
        console.log(err);
      });

  }


}


let setup = new Setup();


export { setup as Setup };
