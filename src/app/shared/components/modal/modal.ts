import { Component, input, output } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { UiButton } from '../button/button';

@Component({
  selector: 'ui-modal',
  imports: [ClickOutsideDirective, UiButton],
  template: `
    @if (open()) {
      <div class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
        <div class="modal-dialog" uiClickOutside (uiClickOutside)="cancelled.emit()">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title h5">{{ title() }}</h2>
              <button type="button" class="btn-close" aria-label="Cerrar" (click)="cancelled.emit()"></button>
            </div>
            <div class="modal-body">
              <ng-content />
            </div>
            <div class="modal-footer">
              <ui-button variant="outline-secondary" (click)="cancelled.emit()">{{ cancelLabel() }}</ui-button>
              <ui-button variant="danger" (click)="confirmed.emit()">{{ confirmLabel() }}</ui-button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop d-block"></div>
    }
  `,
})
export class UiModal {
  readonly open = input(false);
  readonly title = input('');
  readonly confirmLabel = input('Confirmar');
  readonly cancelLabel = input('Cancelar');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
