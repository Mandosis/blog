import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class Dashboard {
  title = 'dashboard';
}
