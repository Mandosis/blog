import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app',
  template: require('./app.component.pug'),
  styles: [ require('./app.component.scss') ]
})
export class AppComponent {
  title = 'app works!';
}
