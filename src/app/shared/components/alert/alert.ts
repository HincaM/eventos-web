import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-alert',
  template: `
    <div class="alert alert-dismissible d-flex align-items-center" [class]="'alert-' + variant()" role="alert">
      <span class="flex-grow-1">{{ message() }}</span>
      <button type="button" class="btn-close" aria-label="Cerrar" (click)="dismissed.emit()"></button>
    </div>
  `,
})
export class UiAlert {
  readonly message = input.required<string>();
  readonly variant = input<'success' | 'danger' | 'warning' | 'info'>('info');
  readonly dismissed = output<void>();
}
