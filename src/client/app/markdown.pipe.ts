import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';

@Pipe({
  name: 'markdown',
  pure: false
})

export class MarkdownPipe implements PipeTransform {
  transform(value: string) {
    return marked(value);
  }
}
