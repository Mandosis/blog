import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'dashboard-home',
  template: require('./dashboard-home.component.pug'),
  styles: [ require('./dashboard-home.component.scss') ],
  directives: [ROUTER_DIRECTIVES]
})

export class DashboardHomeComponent {
  title = 'Home';

  sayHello() {
    console.log('Hello!');
  }
}
