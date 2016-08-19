import { Component } from '@angular/core';

@Component({
  selector: 'login',
  template: require('./login.component.pug'),
  styles: [ require('./login.component.scss') ]
})

export class LoginComponent {
  username = '';
  password = '';
}
