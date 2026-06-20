import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface RangoFechas {
  desde: string | null;
  hasta: string | null;
}

@Component({
  selector: 'ui-date-range-picker',
  imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <div class="ui-date-range-picker">
      @if (label()) {
        <label class="form-label">{{ label() }}</label>
      }
      <mat-form-field appearance="outline" subscriptSizing="dynamic" class="ui-date-range-picker__field">
        <mat-date-range-input [formGroup]="rango" [rangePicker]="picker">
          <input matStartDate formControlName="desde" placeholder="Desde" />
          <input matEndDate formControlName="hasta" placeholder="Hasta" />
        </mat-date-range-input>
        <mat-datepicker-toggle matIconSuffix [for]="picker" />
        <mat-date-range-picker #picker />
      </mat-form-field>
    </div>
  `,
  styleUrl: './date-range-picker.scss',
})
export class UiDateRangePicker {
  readonly label = input<string>('');
  readonly rangoCambiado = output<RangoFechas>();

  protected readonly rango = new FormGroup({
    desde: new FormControl<Date | null>(null),
    hasta: new FormControl<Date | null>(null),
  });

  constructor() {
    this.rango.valueChanges.subscribe((value) =>
      this.rangoCambiado.emit({
        desde: this.toIsoDate(value.desde ?? null),
        hasta: this.toIsoDate(value.hasta ?? null),
      }),
    );
  }

  private toIsoDate(date: Date | null): string | null {
    if (!date) {
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
