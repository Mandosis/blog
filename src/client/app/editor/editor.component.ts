import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { MarkdownPipe} from '../markdown.pipe';
import { WordCount } from '../word-count.pipe';

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

export class EditorComponent {
  viewSettings: boolean = false;

  post: Object = {
    title: 'Welcome to the Editor',
    body: '# Hello'
  }
  title: string = 'Editor';

  extendSettings(): void {
    if (this.viewSettings) {
      this.viewSettings = false;
    } else {
      this.viewSettings = true;
    }
  }

  toUrl(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^\w ]+/g,'')
      .replace(/ +/g,'-');
  }
}
