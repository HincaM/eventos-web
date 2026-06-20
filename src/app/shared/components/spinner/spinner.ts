import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-spinner',
  template: `
    <div class="d-flex justify-content-center align-items-center p-4" role="status">
      <span class="spinner-border" [class]="'text-' + variant()"></span>
      <span class="visually-hidden">Cargando...</span>
    </div>
  `,
})
export class UiSpinner {
  readonly variant = input<'primary' | 'secondary'>('primary');
}
