import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-selector',
  template: `
    @if (items().length === 0) {
      <p class="text-muted mb-0">{{ vacioMensaje() }}</p>
    } @else {
      <select class="form-select" (change)="onSeleccionar($event)">
        <option value="">{{ placeholder() }}</option>
        @for (item of items(); track valueFn()(item)) {
          <option [value]="valueFn()(item)">{{ labelFn()(item) }}</option>
        }
      </select>
    }
  `,
})
export class UiSelector<T> {
  readonly items = input<readonly T[]>([]);
  readonly labelFn = input.required<(item: T) => string>();
  readonly valueFn = input.required<(item: T) => string>();
  readonly placeholder = input('Selecciona una opción');
  readonly vacioMensaje = input('No hay opciones disponibles.');

  readonly seleccionado = output<string>();

  protected onSeleccionar(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value) {
      this.seleccionado.emit(value);
    }
  }
}
