import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'dashboard-home',
  template: require('./home.component.pug'),
  styles: [ require('./home.component.scss') ],
  directives: [ROUTER_DIRECTIVES]
})

export class DashboardHome {
  title = 'Home';

  sayHello() {
    console.log('Hello!');
  }
}
