import { Pipe, PipeTransform } from '@angular/core';
import * as hljs from 'highlight.js';

@Pipe({
  name: 'highlightSyntax'
})

export class SyntaxHighlightPipe implements PipeTransform {
  transform(value: string, language: string) {
    return hljs.highlight(language, value).value;
  }
}
