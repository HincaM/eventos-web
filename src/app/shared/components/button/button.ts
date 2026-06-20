import { Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline-secondary';

@Component({
  selector: 'ui-button',
  template: `
    <button
      [type]="type()"
      class="btn d-inline-flex align-items-center gap-2"
      [class]="'btn-' + variant()"
      [disabled]="disabled() || loading()"
    >
      @if (loading()) {
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
})
export class UiButton {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
}
