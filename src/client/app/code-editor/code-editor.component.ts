import {
  Component,
  Input,
  Output,
  ElementRef,
  ViewChild,
  EventEmitter,
  forwardRef,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

declare var CodeMirror: any;

@Component({
  selector: 'code-editor',
  template: `<textarea #host></textarea>`,
  styles: [
    require('../../../../node_modules/codemirror/lib/codemirror.css'),
    require('./code-editor.component.scss')
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeEditorComponent),
      multi: true
    }
  ]
})

export class CodeEditorComponent {

  @Input() config;

  @Output() change = new EventEmitter();
  @ViewChild('host') host;

  private _value = '';

  @Output() instance = null;

  constructor(){};

  get value(): any {
    return this._value;
  }

  @Input() set value(input) {
    if (input !== this._value) {
      this._value = input;
      this.onChange(input);
    }
  }

  ngAfterViewInit(){
    this.config = this.config || {};
    this.codemirrorInit(this.config);
  }

  /**
   * Initialize codemirror
   */
  codemirrorInit(config){
    this.instance = CodeMirror.fromTextArea(this.host.nativeElement, config);
    this.instance.on('change', () => {
      this.updateValue(this.instance.getValue());
    });
  }

  /**
   * Value update process
   */
  updateValue(value){
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.change.emit(value);
  }

  /**
   * Implements ControlValueAccessor
   */
  writeValue(value){
    this._value = value || '';
    if (this.instance) {
      this.instance.setValue(this._value);
    }
  }
  onChange(_){}
  onTouched(){}
  registerOnChange(fn){this.onChange = fn;}
  registerOnTouched(fn){this.onTouched = fn;}

}
