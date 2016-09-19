import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'editor',
  template: require('./editor.component.pug'),
  styles: [ require('./editor.component.scss') ],
})

export class EditorComponent {
  viewSettings: boolean = false;
  isSelected: boolean = false;
  selectionStart: number;
  selectionEnd: number;
  cursorPosition: number;
  listFormat: string;

  inputs: Array<Object> = [{
    value: '# Hello',
    type: 'markdown'
  }];

  post = {
    title: 'Welcome to the Editor',
    body: '# Hello'
  }
  title: string = 'Editor';

  caret: any = {
    selectionStart: 0,
    selectionEnd: 0,
    move: false
  };

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

      this.caret.selectionStart = editor.selectionStart;
      this.caret.selectionEnd = editor.selectionEnd;
      this.caret.move = true;

      // The value of the textarea must be set directly to move caret;
      // this.post.body = completedString;
      editor.value = completedString;
      editor.blur();
      editor.focus();
      editor.setSelectionRange(editor.selectionStart - syntax.length, editor.selectionEnd - syntax.length);

    } else {
      let beforeSelection = (this.post.body).substring(0, this.selectionStart);
      let afterSelection = (this.post.body).substring(this.selectionEnd, this.post.body.length);
      let selection = (this.post.body).substring(this.selectionStart, this.selectionEnd);

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
    console.log('Current Line Value:', currentLine.value.replace(/(\n)/g, '\\n'));

    // FIX ngModel not updating until user input in textarea (possible fix: bind value of textarea instead of model)
    // FIX syntax inserting at end of line if there is content below

    editor.value = completedString;

    this.post.body = editor.value;

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

      if (/^(\n)/g.test(currentLine)) {
        console.log('Line starts with \\n')
        lineStart++;
      }

      if (/$(\n)/g.test(currentLine)) {
        console.log('Line ends with \\n');
        lineEnd--;
      }

      currentLine = currentLine.replace(/(\n)/g, '');

    }

    return {
      start: lineStart,
      end: lineEnd,
      value: currentLine,
      isEmpty: (/\s/g.test(currentLine) && !/\S/g.test(currentLine))
    };

  }

  updateCaretPosition(event) {

    console.log('event',event);

    this.post.body = this.post.body;

    if (this.caret.move) {

      console.log('moving caret position...');
      let editor = document.getElementsByTagName('textarea')[0];

      editor.setSelectionRange(this.caret.selectionStart, this.caret.selectionEnd);

      this.caret.move = false;
    }
  }

  /**
   * Inserts a code editor with a text area after
   */
  insertCodeEditor() {
    this.inputs.push({
      type:'code',
      value: '',
      language: 'javascript'
    });

    this.inputs.push({
      type: 'markdown',
      value: ''
    })
  }

  /**
   * Automatically resizes textareas inside the editor
   */
  autoResizeTextarea(event) {
    let textarea = event.target;

    textarea.style.overflow = 'hidden';
    textarea.rows = 1;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  /**
   * Adds a language class to pre and code elements for syntax highlighting
   */
  addLanguageClass(input) {
    let css = {};

    css['language-' + input.language] = true;

    return css;
  }

  /**
   * Puts focus on the last input in the editor if the user clicks on container
   */
  focusLastInput(event) {
    let element: HTMLDivElement = event.target;

    let textAreaList: NodeListOf<HTMLTextAreaElement> = element.getElementsByTagName('textarea');
    let lastTextArea = textAreaList[textAreaList.length - 1];
    
    // Prevent error when clicking on the last text area
    if (lastTextArea) {
      lastTextArea.focus();
    }
  }

  /**
   * Syncronise scrolling position for both the editor and the preview
   */
  syncScrollPosition(element) {
    let editor: Element = document.getElementsByClassName('editor')[0];
    let preview: Element = document.getElementsByClassName('preview')[0];

    let scrollTopPercent: number = editor.scrollTop / editor.scrollHeight;
    let scrollLeftPercent: number = editor.scrollLeft / editor.scrollWidth;

    preview.scrollTop = preview.scrollHeight * scrollTopPercent;
    preview.scrollLeft = preview.scrollWidth * scrollLeftPercent;

  }
}
