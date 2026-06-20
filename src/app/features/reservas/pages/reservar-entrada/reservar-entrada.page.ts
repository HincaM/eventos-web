import { Component, computed, inject, input, signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';
import { EventoSelector } from './components/evento-selector/evento-selector';
import { ReservaForm } from './components/reserva-form/reserva-form';
import { ReservaResultado } from './components/reserva-resultado/reserva-resultado';
import { Reserva } from '../../core/domain/models/reserva.model';
import { ReservarEntradaRequest } from '../../core/domain/models-request/reservar-entrada.request';
import { ReservarEntradaUseCase } from '../../core/application/use-cases/reservar-entrada.use-case';
import { ConfirmarPagoReservaUseCase } from '../../core/application/use-cases/confirmar-pago-reserva.use-case';
import { CancelarReservaUseCase } from '../../core/application/use-cases/cancelar-reserva.use-case';

@Component({
  selector: 'reservar-entrada-page',
  imports: [EventoSelector, ReservaForm, ReservaResultado],
  templateUrl: './reservar-entrada.page.html',
})
export class ReservarEntradaPage {
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

  protected onNuevaReserva(): void {
    this.reserva.set(null);
    this.eventoSeleccionadoManualmente.set(null);
    this.forzarSelector.set(true);
  }
}
