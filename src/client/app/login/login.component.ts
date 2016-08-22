import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'login',
  template: require('./login.component.pug'),
  styles: [ require('./login.component.scss') ]
})

export class LoginComponent {
  email: string;
  password: string;
  error: string;

  constructor(private user: UserService, private router: Router ) {};

  login() {
    console.log('Email:', this.email, '\nPassword:', this.password);
    this.user.login(this.email, this.password)
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['/dashboard']);
        }
      }, (error) => {
        this.error = 'Username or password incorrect';
      });
  }

}
