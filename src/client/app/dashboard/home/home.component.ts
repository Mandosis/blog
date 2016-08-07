import { Component } from '@angular/core';

@Component({
  selector: 'dashboard-home',
  template: require('./home.component.pug'),
  styles: [ require('./home.component.scss') ],
})

export class DashboardHome {
  title = 'Home';

  sayHello() {
    console.log('Hello!');
  }
}
