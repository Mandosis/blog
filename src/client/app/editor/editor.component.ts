import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { MarkdownPipe} from '../markdown.pipe';
import { WordCount } from '../word-count.pipe';
import { SpeakingurlPipe } from '../speakingurl.pipe';

@Component({
  selector: 'editor',
  template: require('./editor.component.pug'),
  styles: [ require('./editor.component.scss') ],
  directives: [ ROUTER_DIRECTIVES ],
  pipes: [
    MarkdownPipe,
    WordCount,
    SpeakingurlPipe
  ]
})

export class EditorComponent {
  viewSettings: boolean = false;
  isSelected: boolean = false;
  selectionStart: number;
  selectionEnd: number;
  cursorPosition: number;

  post = {
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

  getSelected(event: any) {


    this.isSelected = true;

    let editor = event.target;
    this.selectionStart = editor.selectionStart;
    this.selectionEnd = editor.selectionEnd;
  }

  setCursorPosition(event: any) {
    this.isSelected = false;
    let editor = event.target;

    this.cursorPosition = editor.selectionStart;

    console.log('Curosor Position:', this.cursorPosition);
  }

  setBold() {

    console.log('isSelected', this.isSelected);

    if (!this.isSelected) {
      let beforeSelection = (this.post.body).substring(0, this.cursorPosition - 1);
      let afterSelection = (this.post.body).substring(this.cursorPosition + 1, this.post.body.length);
      let boldSyntax = '****';

      let completedString = beforeSelection + boldSyntax + afterSelection;

      this.post.body = completedString;
    } else {
      let beforeSelection = (this.post.body).substring(0, this.selectionStart - 1);
      let afterSelection = (this.post.body).substring(this.selectionEnd + 1, this.post.body.length);
      let selection = (this.post.body).substring(this.selectionStart, this.selectionEnd)

      let boldSelection = '**' + selection + '**';

      let completedString = beforeSelection + boldSelection + afterSelection;

      this.post.body = completedString;

    }
  }
}
