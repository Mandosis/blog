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

  getCaretPosition(event: any) {
    this.isSelected = false;
    let editor = event.target;

    this.cursorPosition = editor.selectionStart;

  }

  formatSelected(syntax:string) {

    if (!this.isSelected) {
      let editor = document.getElementsByTagName('textarea')[0];

      let beforeSelection = (this.post.body).substring(0, editor.selectionStart);
      let afterSelection = (this.post.body).substring(editor.selectionEnd, this.post.body.length);

      let completedString = beforeSelection + syntax + syntax + afterSelection;

      this.post.body = completedString;

    } else {
      let beforeSelection = (this.post.body).substring(0, this.selectionStart);
      let afterSelection = (this.post.body).substring(this.selectionEnd, this.post.body.length);
      let selection = (this.post.body).substring(this.selectionStart, this.selectionEnd)

      let completedString = beforeSelection + syntax + selection + syntax + afterSelection;

      this.post.body = completedString;

    }

  }

  insertSyntax(syntax: string) {
    let beforeSelection = (this.post.body).substring(0, this.cursorPosition);
    let afterSelection = (this.post.body).substring(this.cursorPosition, this.post.body.length);

    let completedString = beforeSelection + afterSelection + `\n${syntax}\n`;

    this.post.body = completedString;
  }

}
