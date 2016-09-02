import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'dashboard',
  template: require('./dashboard.component.pug'),
  styles: [ require('./dashboard.component.scss') ],
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class DashboardComponent {
  title = 'dashboard';
  menuOpen: boolean = false;
  menuCollapsed: boolean = false;

  extendMenu() {
    if(this.menuOpen) {
      this.menuOpen = false;
    } else {
      this.menuOpen = true;
    }

    console.log('extendMenu', this.menuOpen);
  }

  toggleNavWidth() {
    if(this.menuCollapsed) {
      this.menuCollapsed = false;
    } else {
      this.menuCollapsed = true;
    }
  }


}
