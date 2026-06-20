import { Component, input } from '@angular/core';

interface FieldErrorLike {
  message?: string;
}

@Component({
  selector: 'ui-form-error',
  template: `
    @if (visible()) {
      <div class="invalid-feedback d-block">{{ errors()[0]?.message }}</div>
    }
  `,
})
export class UiFormError {
  readonly errors = input<readonly FieldErrorLike[]>([]);
  readonly touched = input(false);

  protected visible(): boolean {
    return this.touched() && this.errors().length > 0;
  }
}
