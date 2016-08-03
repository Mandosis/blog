import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Http } from '@angular/http';

@Component({
  selector: 'app',
  directives: [
    ROUTER_DIRECTIVES
  ],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class App {
  title = 'app works!';
}
