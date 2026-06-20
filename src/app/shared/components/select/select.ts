import { Component, input, model, output } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'ui-select',
  template: `
    <select [id]="id()" class="form-select" [value]="value()" (change)="onChange($event)">
      <option value="">{{ placeholder() }}</option>
      @for (item of items(); track codigoFn()(item)) {
        <option [value]="codigoFn()(item)">{{ descripcionFn()(item) }}</option>
      }
    </select>
  `,
})
export class UiSelect<T> implements FormValueControl<string> {
  readonly id = input('');
  readonly items = input<readonly T[]>([]);
  readonly codigoFn = input.required<(item: T) => string>();
  readonly descripcionFn = input.required<(item: T) => string>();
  readonly placeholder = input('Selecciona una opción');

  readonly value = model.required<string>();
  readonly selected = output<T | undefined>();

  protected onChange(event: Event): void {
    const codigo = (event.target as HTMLSelectElement).value;
    this.value.set(codigo);
    this.selected.emit(this.items().find((item) => this.codigoFn()(item) === codigo));
  }
}
