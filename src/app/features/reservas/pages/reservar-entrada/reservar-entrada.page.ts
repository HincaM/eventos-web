import { Component, inject, input, signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReservaForm } from './components/reserva-form/reserva-form';
import { ReservaResultado } from './components/reserva-resultado/reserva-resultado';
import { Reserva } from '../../core/domain/models/reserva.model';
import { ReservarEntradaRequest } from '../../core/domain/models-request/reservar-entrada.request';
import { ReservarEntradaUseCase } from '../../core/application/use-cases/reservar-entrada.use-case';
import { ConfirmarPagoReservaUseCase } from '../../core/application/use-cases/confirmar-pago-reserva.use-case';
import { CancelarReservaUseCase } from '../../core/application/use-cases/cancelar-reserva.use-case';

@Component({
  selector: 'reservar-entrada-page',
  imports: [ReservaForm, ReservaResultado],
  template: `
    <h1 class="h3 mb-4">Reservar entrada</h1>

    @if (reserva(); as actualReserva) {
      <reserva-resultado
        [reserva]="actualReserva"
        [confirmando]="confirmando()"
        (confirmarPago)="onConfirmarPago(actualReserva.id)"
        (cancelar)="onCancelar(actualReserva.id)"
      />
    } @else {
      <reserva-form [eventoId]="eventoId()" [reservando]="reservando()" (reservar)="onReservar($event)" />
    }
  `,
})
export class ReservarEntradaPage {
  private readonly reservarEntradaUseCase = inject(ReservarEntradaUseCase);
  private readonly confirmarPagoReservaUseCase = inject(ConfirmarPagoReservaUseCase);
  private readonly cancelarReservaUseCase = inject(CancelarReservaUseCase);
  private readonly notificationService = inject(NotificationService);

  readonly eventoId = input.required<string>();

  protected readonly reserva = signal<Reserva | null>(null);
  protected readonly reservando = signal(false);
  protected readonly confirmando = signal(false);

  protected onReservar(request: ReservarEntradaRequest): void {
    this.reservando.set(true);
    this.reservarEntradaUseCase.execute(request).subscribe({
      next: (reserva) => {
        this.reservando.set(false);
        this.reserva.set(reserva);
        this.notificationService.show('Reserva creada correctamente.', 'success');
      },
      error: () => this.reservando.set(false),
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
}
