import { Pipe, PipeTransform } from '@angular/core';
const url = require('speakingurl');

@Pipe({
  name: 'url'
})

export class SpeakingurlPipe implements PipeTransform {
  transform(value: string) {
    return url(value);
  }
}
