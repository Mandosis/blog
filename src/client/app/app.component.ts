import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Http } from '@angular/http';

@Component({
  selector: 'app',
  directives: [
    ROUTER_DIRECTIVES
  ],
  template: require('./app.component.pug'),
  styles: [ require('./app.component.scss') ]
})
export class AppComponent {
  title = 'app works!';
}
