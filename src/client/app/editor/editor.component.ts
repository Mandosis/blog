import { Component, OnInit } from '@angular/core';
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

export class EditorComponent implements OnInit {
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

  insertSyntax(syntax: string, wrap: boolean): void {
    if (wrap) {
      this._insertWrappingSyntax(syntax);
    } else {
      this._insertNonWrappingSyntax(syntax);
    }
  }

  private _insertWrappingSyntax(syntax: string): void {
    if (!this.isSelected) {
      let editor = document.getElementsByTagName('textarea')[0];

      let beforeSelection = (this.post.body).substring(0, editor.selectionStart);
      let afterSelection = (this.post.body).substring(editor.selectionEnd, this.post.body.length);

      let completedString = beforeSelection + syntax + syntax + afterSelection;

      // The value of the textarea must be set directly to move caret;
      // this.post.body = completedString;

      editor.value = completedString;
      editor.setSelectionRange(editor.selectionStart - syntax.length, editor.selectionEnd - syntax.length);

    } else {
      let beforeSelection = (this.post.body).substring(0, this.selectionStart);
      let afterSelection = (this.post.body).substring(this.selectionEnd, this.post.body.length);
      let selection = (this.post.body).substring(this.selectionStart, this.selectionEnd)

      let completedString = beforeSelection + syntax + selection + syntax + afterSelection;

      this.post.body = completedString;

    }

  }

  private _insertNonWrappingSyntax(syntax: string): void {
    let beforeSelection = (this.post.body).substring(0, this.cursorPosition);
    let afterSelection = (this.post.body).substring(this.cursorPosition, this.post.body.length);

    let completedString = beforeSelection + afterSelection + `\n${syntax}`;

    this.post.body = completedString;
  }

}
