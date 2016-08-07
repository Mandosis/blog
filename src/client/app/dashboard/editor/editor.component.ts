import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { MarkdownPipe} from '../../markdown.pipe';

@Component({
  selector: 'editor',
  template: require('./editor.component.pug'),
  styles: [ require('./editor.component.scss') ],
  directives: [ ROUTER_DIRECTIVES ],
  pipes: [MarkdownPipe]
})

export class Editor {
  title: string = 'Editor';
  body: string = '#Hello';
}
