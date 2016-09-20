import {
  Component,
  Input,
  Output,
  ElementRef,
  ViewChild,
  EventEmitter,
  forwardRef,
  ViewEncapsulation,
  Renderer
} from '@angular/core';

import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'markdown-editor',
  template: `<textarea #host (input)="autoResizeTextarea($event)"></textarea>`,
  styles: [ require('./markdown-editor.component.scss')],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true
    }
  ]
})

export class MarkdownEditorComponent {
  @Input() model: any;

  @Output() change: EventEmitter<any> = new EventEmitter();

  /**
   * Simulate textarea events
   */
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() blur: EventEmitter<any> = new EventEmitter();

  @ViewChild('host') host;

  private _value: string = '';

  @Output() instance = null;

  constructor(public renderer: Renderer) {};

  get value(): any {
    return this._value;
  }

  @Input() set value(input) {
    if (input !== this._value) {
      this._value = input;
      this.onChange(input);
    }
  }

  ngAfterViewInit() {

    this.instance = this.host.nativeElement

    // Add input event listener
    this.renderer.listen(this.instance, 'input', () => {
      this.updateValue(this.host.nativeElement.value);
    });

    // Add focus event listener
    this.renderer.listen(this.instance, 'focus', () => {
      this.updateValue(this.host.nativeElement.value);
      this.focus.emit(null);
    });

    // Add blur event listener
    this.renderer.listen(this.instance, 'blur', () => {
      this.blur.emit(null);
    });

  }

  updateValue(value) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.change.emit(value);
  }

  /**
   * Implements ControlValueAccessor
   */
  writeValue(value) {
    this._value = value || '';

    if (this.host) {
      this.host.nativeElement.value = this._value;
    }
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


  onChange(_) {};
  onTouched() {};
  registerOnChange(fn) { this.onChange = fn; }
  registerOnTouched(fn) { this.onTouched = fn; }
}
