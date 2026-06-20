import { Component, computed, inject, input, signal } from '@angular/core';
import { FormField, email, form, min, required, schema, submit } from '@angular/forms/signals';
import { EstadoEventoActual } from '../../../../core/enums/estado-evento.enum';
import { NotificationService } from '../../../../core/services/notification.service';
import { UiButton } from '../../../../shared/components/button/button';
import { UiFormError } from '../../../../shared/components/form-error/form-error';
import { UiSelector } from '../../../../shared/components/selector/selector';
import { ReservaResultado } from './components/reserva-resultado/reserva-resultado';
import { Evento } from '../../../eventos/core/domain/models/evento.model';
import { ListarEventosUseCase } from '../../../eventos/core/application/use-cases/listar-eventos.use-case';
import { Reserva } from '../../core/domain/models/reserva.model';
import { ReservarEntradaUseCase } from '../../core/application/use-cases/reservar-entrada.use-case';
import { ConfirmarPagoReservaUseCase } from '../../core/application/use-cases/confirmar-pago-reserva.use-case';
import { CancelarReservaUseCase } from '../../core/application/use-cases/cancelar-reserva.use-case';

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
  selector: 'reservar-entrada-page',
  imports: [FormField, UiButton, UiFormError, UiSelector, ReservaResultado],
  templateUrl: './reservar-entrada.page.html',
})
export class ReservarEntradaPage {
  private readonly listarEventosUseCase = inject(ListarEventosUseCase);
  private readonly reservarEntradaUseCase = inject(ReservarEntradaUseCase);
  private readonly confirmarPagoReservaUseCase = inject(ConfirmarPagoReservaUseCase);
  private readonly cancelarReservaUseCase = inject(CancelarReservaUseCase);
  private readonly notificationService = inject(NotificationService);

  readonly eventoId = input<string>('');

  protected readonly eventoSeleccionadoManualmente = signal<string | null>(null);
  protected readonly forzarSelector = signal(false);
  protected readonly eventoIdEfectivo = computed(() =>
    this.forzarSelector() ? null : this.eventoSeleccionadoManualmente() ?? (this.eventoId() || null),
  );

  protected readonly eventosActivos = signal<Evento[]>([]);
  protected readonly eventoLabel = (evento: Evento) => evento.titulo;
  protected readonly eventoValue = (evento: Evento) => evento.id;

  protected readonly reserva = signal<Reserva | null>(null);
  protected readonly reservando = signal(false);
  protected readonly confirmando = signal(false);

  protected readonly model = signal<ReservarEntradaFormModel>({
    cantidad: 1,
    nombreComprador: '',
    emailComprador: '',
  });

  protected readonly form = form(this.model, reservarEntradaSchema);

  constructor() {
    this.listarEventosUseCase
      .execute({ estado: EstadoEventoActual.Activo })
      .subscribe((eventos) => this.eventosActivos.set(eventos));
  }

  protected onSubmitReserva(event: SubmitEvent): void {
    event.preventDefault();
    void submit(this.form, async (field) => {
      const value = field().value();
      this.reservando.set(true);
      this.reservarEntradaUseCase
        .execute({
          eventoId: this.eventoIdEfectivo()!,
          cantidad: value.cantidad,
          nombreComprador: value.nombreComprador,
          emailComprador: value.emailComprador,
        })
        .subscribe({
          next: (reserva) => {
            this.reservando.set(false);
            this.reserva.set(reserva);
            this.notificationService.show('Reserva creada correctamente.', 'success');
          },
          error: () => this.reservando.set(false),
        });
      return undefined;
    });
  }

  protected onConfirmarPago(reservaId: string): void {
    this.confirmando.set(true);
    this.confirmarPagoReservaUseCase.execute(reservaId).subscribe({
      next: (reserva) => {
        this.confirmando.set(false);
        this.reserva.set(reserva);
        this.notificationService.show('Pago confirmado correctamente.', 'success');
      },
      error: () => this.confirmando.set(false),
    });
  }

  protected onCancelar(reservaId: string): void {
    this.cancelarReservaUseCase.execute(reservaId).subscribe({
      next: (reserva) => {
        this.reserva.set(reserva);
        this.notificationService.show('Reserva cancelada.', 'info');
      },
    });
  }

  protected onNuevaReserva(): void {
    this.reserva.set(null);
    this.eventoSeleccionadoManualmente.set(null);
    this.forzarSelector.set(true);
    this.model.set({ cantidad: 1, nombreComprador: '', emailComprador: '' });
  }
}
