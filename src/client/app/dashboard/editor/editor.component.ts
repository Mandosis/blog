import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { MarkdownPipe} from '../../markdown.pipe';
import { WordCount } from '../../word-count.pipe';

@Component({
  selector: 'editor',
  template: require('./editor.component.pug'),
  styles: [ require('./editor.component.scss') ],
  directives: [ ROUTER_DIRECTIVES ],
  pipes: [
    MarkdownPipe,
    WordCount
  ]
})

export class Editor {
  post: Object = {
    title: 'Welcome to the Editor',
    body: '# Hello'
  }
  title: string = 'Editor';
}
