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
    let input: any = this._getFocusedInput();

    let isSelected: boolean = !(input.selectionStart == input.selectionEnd);
    let notNull: boolean = (input.selectionStart !== null && input.selectionEnd !== null);

    if (!isSelected && notNull) {
      let beforeSelection: string = (input.value).substring(0, input.selectionStart);
      let afterSelection: string = (input.value).substring(input.selectionEnd, input.value.length);

      let completedString: string = beforeSelection + syntax + syntax + afterSelection;

      let caretPosition: number = input.selectionEnd + syntax.length;

      input.update(completedString);
      input.setCursor(caretPosition);

    } else {
      let beforeSelection = (input.value).substring(0, input.selectionStart);
      let afterSelection = (input.value).substring(input.selectionEnd, input.value.length);
      let selection = (input.value).substring(input.selectionStart, input.selectionEnd);

      let completedString = beforeSelection + syntax + selection + syntax + afterSelection;

      let caretPosition: number = input.selectionEnd + (syntax.length * 2);

      input.update(completedString);
      input.setCursor(caretPosition);

    }

  }

  private _insertNonWrappingSyntax(syntax: string): void {

    syntax = '\n' + syntax;

    let input = this._getFocusedInput();

    let beforeSelection = (input.value).substring(0, input.selectionEnd);
    let afterSelection = (input.value).substring(input.selectionEnd, input.value.length);

    let completedString = beforeSelection + syntax + afterSelection;
    let caretPosition = input.selectionEnd + syntax.length;

    input.update(completedString);
    input.setCursor(caretPosition);
  }

  private _insertListSyntax(syntax: string): void {
    let input: any = this._getFocusedInput();
    let currentLine: any = this._getCurrentLine();

    let syntaxExp: RegExp = new RegExp('^(' + syntax + ')','g');

    let startsWithSyntax: boolean = syntaxExp.test(currentLine.value);

    let beforeCurrentLine: string = (input.value).substring(0, currentLine.start);
    let afterCurrentLine: string = (input.value).substring(currentLine.end, input.value.length);
    let completedString: string;
    let caretPosition: number;

    console.log(startsWithSyntax);


    if (startsWithSyntax) {
      currentLine.value = currentLine.value.replace(syntaxExp, '');
      console.log(currentLine.value)

      completedString = beforeCurrentLine + currentLine.value + afterCurrentLine;
      caretPosition = input.selectionEnd - syntax.length;
    } else {
      completedString = beforeCurrentLine + syntax + currentLine.value + afterCurrentLine;
      caretPosition = input.selectionEnd + syntax.length;

    }
    input.update(completedString);
    input.setCursor(caretPosition);

  }

  /**
   * Gets the contents of the current line of focused input
   */
  private _getCurrentLine() {

    let input: any = this._getFocusedInput(); 

    let lineStart: number;
    let lineEnd: number;

    // Get text before caret
    for(lineStart = input.selectionStart - 1; lineStart >= 0 && input.value[lineStart] != '\n'; --lineStart);

    // Get text after the caret
    for(lineEnd = input.selectionStart + 1; lineEnd < input.value.length && input.value[lineEnd] != '\n'; ++lineEnd);


    // Get substring of current line
    let currentLine = (input.value).substring(lineStart, lineEnd);

    // Adjust for new line at beginning
    if (/^(\n)/g.test(currentLine)) {
      lineStart++;
    }

    // Adjust for new line at end
    if (/(\n)$/g.test(currentLine)) {
      lineEnd--;
    }

    currentLine = currentLine.replace(/(\n)/g, '');

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
    });

    let currentInput = this._getFocusedInput
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
  private _getFocusedInput() {
    let inputIndex: number = this.focusedInput.index;
    let inputValue: string = this.inputs[inputIndex].value;
    let inputType: string = this.inputs[inputIndex].type;
    let selectionStart: number;
    let selectionEnd: number;

    // Get all code-editor and markdown-editor elements
    let nodeList: NodeListOf<Element> = document.querySelectorAll('code-editor, markdown-editor');

    // Get the focused element
    let containerElement: Element = nodeList[this.focusedInput.index];

    let inputElement: any;


    if (inputType === 'markdown') {
      inputElement = containerElement.getElementsByTagName('textarea')[0];
      selectionStart = inputElement.selectionStart;
      selectionEnd = inputElement.selectionEnd;
    } else {
      inputElement = containerElement.getElementsByClassName('CodeMirror')[0];
    }


    // Get the textarea inside

    let update = (value: string) => {

      if (inputType === 'markdown') {
        inputElement.value = value;
        inputElement.blur();
        inputElement.focus();

      } else {
        inputElement.setValue(value);
      }
    };

    let setCursor = (start: number, end?: number) => {
      if (!end) {
        end = start;
      }

      if (inputType === 'markdown') {
        inputElement.setSelectionRange(start, end);
      } else {
        inputElement.setSelection(start, end);
      }
    };

    let api: Object = {
      index: inputIndex,
      value: inputValue,
      element: inputElement,
      selectionStart: selectionStart,
      selectionEnd: selectionEnd,
      update: update,
      setCursor: setCursor
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
