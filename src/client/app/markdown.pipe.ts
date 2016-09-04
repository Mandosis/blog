import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';
import * as marked from 'marked';

@Pipe({
  name: 'markdown'
})

export class MarkdownPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizationService) {}
  transform(value: string) {
    return this._sanitizer.bypassSecurityTrustHtml(marked(value));
  }
}
