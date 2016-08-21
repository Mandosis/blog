import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'login',
  template: require('./login.component.pug'),
  styles: [ require('./login.component.scss') ]
})

export class LoginComponent {
  username = '';
  password = '';

  constructor(private userService: UserService) {};

  
}
