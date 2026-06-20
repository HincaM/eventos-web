import { Component, input, output, signal } from '@angular/core';
import { FormField, email, form, min, required, schema, submit } from '@angular/forms/signals';
import { UiButton } from '../../../../../../shared/components/button/button';
import { UiFormError } from '../../../../../../shared/components/form-error/form-error';
import { ReservarEntradaRequest } from '../../../../core/domain/models-request/reservar-entrada.request';

interface ReservarEntradaFormModel {
  cantidad: number;
  nombreComprador: string;
  emailComprador: string;
}

const reservarEntradaSchema = schema<ReservarEntradaFormModel>((path) => {
  min(path.cantidad, 1, { message: 'Debes reservar al menos 1 entrada.' });
  required(path.nombreComprador, { message: 'El nombre del comprador es obligatorio.' });
  required(path.emailComprador, { message: 'El email del comprador es obligatorio.' });
  email(path.emailComprador, { message: 'Ingresa un email válido.' });
});

@Component({
  selector: 'reserva-form',
  imports: [FormField, UiButton, UiFormError],
  template: `
    <form (submit)="onSubmit($event)" novalidate>
      <div class="mb-3">
        <label class="form-label" for="cantidad">Cantidad de entradas</label>
        <input id="cantidad" type="number" class="form-control" [formField]="form.cantidad" />
        <ui-form-error [errors]="form.cantidad().errors()" [touched]="form.cantidad().touched()" />
      </div>

      <div class="mb-3">
        <label class="form-label" for="nombreComprador">Nombre del comprador</label>
        <input id="nombreComprador" type="text" class="form-control" [formField]="form.nombreComprador" />
        <ui-form-error [errors]="form.nombreComprador().errors()" [touched]="form.nombreComprador().touched()" />
      </div>

      <div class="mb-3">
        <label class="form-label" for="emailComprador">Email del comprador</label>
        <input id="emailComprador" type="email" class="form-control" [formField]="form.emailComprador" />
        <ui-form-error [errors]="form.emailComprador().errors()" [touched]="form.emailComprador().touched()" />
      </div>

      <ui-button type="submit" [loading]="reservando()">Reservar entrada</ui-button>
    </form>
  `,
})
export class ReservaForm {
  readonly eventoId = input.required<string>();
  readonly reservando = input(false);
  readonly reservar = output<ReservarEntradaRequest>();

  protected readonly model = signal<ReservarEntradaFormModel>({
    cantidad: 1,
    nombreComprador: '',
    emailComprador: '',
  });

  protected readonly form = form(this.model, reservarEntradaSchema);

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    void submit(this.form, async (field) => {
      const value = field().value();
      this.reservar.emit({
        eventoId: this.eventoId(),
        cantidad: value.cantidad,
        nombreComprador: value.nombreComprador,
        emailComprador: value.emailComprador,
      });
      return undefined;
    });
  }
}
