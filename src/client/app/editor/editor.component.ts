import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'editor',
  template: require('./editor.component.pug'),
  styles: [ require('./editor.component.scss') ],
})

export class EditorComponent {
  viewSettings: boolean = false;

  // TODO: remove after refactoring formatting controls
  isSelected: boolean = false;
  selectionStart: number;
  selectionEnd: number;
  cursorPosition: number;
  listFormat: string;

  /**
   * Contains the info for the input that has focus.
   * Warning: If modified, resetFocusedElement must also be changed
   */
  focusedInput: any = {
    index: null,
    selectionStart: null,
    selectionEnd: null
  };

  inputs: Array<any> = [{
    value: '# Hello',
    type: 'markdown'
  }];

  // TODO Refactor
  post = {
    title: 'Welcome to the Editor',
    body: ''
  }


  extendSettings(): void {
    if (this.viewSettings) {
      this.viewSettings = false;
    } else {
      this.viewSettings = true;
    }
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
    let input: any = this._getFocusedMarkdownInput();

    let isSelected: boolean = !(input.selectionStart == input.selectionEnd);
    let notNull: boolean = (input.selectionStart !== null && input.selectionEnd !== null);

    if (!isSelected && notNull) {
      let beforeSelection: string = (input.value).substring(0, input.selectionStart);
      let afterSelection: string = (input.value).substring(input.selectionEnd, input.value.length);

      let completedString: string = beforeSelection + syntax + syntax + afterSelection;

      let caretPosition: number = input.selectionEnd + syntax.length;

      input.update(completedString);
      input.moveCaret(caretPosition);

    } else {
      let beforeSelection = (input.value).substring(0, input.selectionStart);
      let afterSelection = (input.value).substring(input.selectionEnd, input.value.length);
      let selection = (input.value).substring(input.selectionStart, input.selectionEnd);

      let completedString = beforeSelection + syntax + selection + syntax + afterSelection;

      let caretPosition: number = input.selectionEnd + (syntax.length * 2);

      input.update(completedString);
      input.moveCaret(caretPosition);

    }

  }

  private _insertNonWrappingSyntax(syntax: string): void {

    syntax = '\n' + syntax;

    let input = this._getFocusedMarkdownInput();

    let beforeSelection = (input.value).substring(0, input.selectionEnd);
    let afterSelection = (input.value).substring(input.selectionEnd, input.value.length);

    let completedString = beforeSelection + syntax + afterSelection;
    let caretPosition = input.selectionEnd + syntax.length;

    input.update(completedString);
    input.moveCaret(caretPosition);
  }

  private _insertListSyntax(syntax: string): void {
    let input: any = this._getFocusedMarkdownInput();
    let currentLine = this._getCurrentLine();

    let beforeCurrentLine = (input.value).substring(0, currentLine.start);
    let afterCurrentLine = (input.value).substring(currentLine.end, input.value.length);


    let completedString = beforeCurrentLine + syntax + ' ' + currentLine.value + afterCurrentLine;

    // console.log(completedString.replace(/(\n)/g, '\\n'));
    // console.log('After Current Line:', afterCurrentLine.replace(/(\n)/g, '\\n'));
    // console.log('Current Line Value:', currentLine.value.replace(/(\n)/g, '\\n'));


    // Update model
    input.update(completedString);

    // if (currentLine.isEmpty) {
    //   console.log('Line is empty');
    // } else {
    //   console.log('Line contains symbols');
    // }


  }

  /**
   * Gets the contents of the current line of focused input
   */
  private _getCurrentLine() {

    let input: any = this._getFocusedMarkdownInput(); 

    let lineStart: number;
    let lineEnd: number;

    // Get text before caret
    for(lineStart = input.selectionStart; lineStart >= 0 && input.value[lineStart] != '\n'; --lineStart);

    // Get text after the caret
    for(lineEnd = input.selectionEnd; lineEnd < input.value.length && input.value[lineEnd] != '\n'; ++lineEnd);

    // Get substring of current line
    let currentLine = (input.value).substring(lineStart, lineEnd);

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

  /**
   * Sets the selected index for the currently focused element
   */
  setFocusedInputSelection(event: any): void {
    let element: HTMLTextAreaElement = event.target;
    this.focusedInput.selectionStart = element.selectionStart;
    this.focusedInput.selectionEnd = element.selectionEnd;
  }

  /**
   * Resets values in focusedInput
   */
  resetFocusedInput(): void {
    this.focusedInput = {
      index: null,
      selectionStart: null,
      selectionEnd: null
    };
  }





  /**
   * Get info for currently focused input
   */
  private _getFocusedMarkdownInput() {
    let inputIndex = this.focusedInput.index;
    let inputValue = this.inputs[inputIndex].value;
    let selectionStart = this.focusedInput.selectionStart;
    let selectionEnd = this.focusedInput.selectionEnd;

    // Get all code-editor and markdown-editor elements
    let nodeList: NodeListOf<Element> = document.querySelectorAll('code-editor, markdown-editor');

    // Get the focused element
    let markdownInput: Element = nodeList[this.focusedInput.index];

    // Get the textarea inside
    let target: HTMLTextAreaElement = markdownInput.getElementsByTagName('textarea')[0];

    let update = (value: string) => {
      target.value = value;
      target.blur();
      target.focus();
    };

    let moveCaret = (start: number, end?: number) => {
      if (!end) {
        end = start;
      }

      target.setSelectionRange(start, end);
    };

    let api = {
      index: inputIndex,
      value: inputValue,
      element: target,
      selectionStart: selectionStart,
      selectionEnd: selectionEnd,
      update: update,
      moveCaret: moveCaret
    };

    return api;
  }

  get combinedBodyValue() {
    let combined: string = '';

    for (let input of this.inputs) {
      combined += `${input.value}\n`;
    }

    return combined;
  };


}
