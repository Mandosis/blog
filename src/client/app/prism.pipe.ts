import { Pipe, PipeTransform } from '@angular/core';
const Prism = require('prismjs');


@Pipe({
  name: 'prism'
})

export class PrismPipe implements PipeTransform {
  transform(value: string, language: string) {
    return Prism.highlight(value, Prism.languages[language]);
  }
}
