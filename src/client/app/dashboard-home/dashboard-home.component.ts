import { Component } from '@angular/core';

@Component({
  selector: 'dashboard-home',
  template: require('./dashboard-home.component.pug'),
  styles: [ require('./dashboard-home.component.scss') ]
})

export class DashboardHomeComponent {
  title = 'Home';

  sayHello() {
    console.log('Hello!');
  }
}
