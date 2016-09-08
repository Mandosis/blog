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

export class EditorComponent {
  viewSettings: boolean = false;
  isSelected: boolean = false;
  selectionStart: number;
  selectionEnd: number;
  cursorPosition: number;
  listFormat: string;

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

  insertSyntax(syntax: string, type: string): void {
    switch(type.toLowerCase()) {
      case 'wrap':
        this._insertWrappingSyntax(syntax);
        break;
      case 'nowrap':
        this._insertNonWrappingSyntax(syntax);
        break;
      case 'list':
        this._insertListSyntax(syntax);
        break;
      default:
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

  private _insertListSyntax(syntax: string): void {
    let editor = document.getElementsByTagName('textarea')[0];
    let currentLine = this._getCurrentLine();

    let beforeCurrentLine = (editor.value).substring(0, currentLine.start);
    let afterCurrentLine = (editor.value).substring(currentLine.end, editor.value.length);


    let completedString = beforeCurrentLine + syntax + ' ' + currentLine.value + afterCurrentLine;

    // console.log(completedString.replace(/(\n)/g, '\\n'));
    console.log('After Current Line:', afterCurrentLine.replace(/(\n)/g, '\\n'));

    // FIX ngModel not updating until user input in textarea (possible fix: bind value of textarea instead of model)
    // FIX syntax inserting at end of line if there is content below

    editor.value = completedString;

    if (currentLine.isEmpty) {
      console.log('Line is empty');
    } else {
      console.log('Line contains symbols');
    }


  }

  private _getCurrentLine() {
    let editor = document.getElementsByTagName('textarea')[0];
    let lineStart: number;
    let lineEnd: number;

    // Get text before caret
    for(lineStart = editor.selectionStart; lineStart >= 0 && editor.value[lineStart] != '\n'; --lineStart);

    // Get text after the caret
    for(lineEnd = editor.selectionEnd; lineEnd < editor.value.length && editor.value[lineEnd] != '\n'; ++lineEnd);

    // Get substring of current line
    let currentLine = (editor.value).substring(lineStart, lineEnd);

    // Adjust for new lines
    if (/(\n)/g.test(currentLine)) {
      currentLine = currentLine.replace(/(\n)/g, '');
      lineStart++;
    }

    return {
      start: lineStart,
      end: lineEnd,
      value: currentLine,
      isEmpty: (/\s/g.test(currentLine) && !/\S/g.test(currentLine))
    };

  }

}
