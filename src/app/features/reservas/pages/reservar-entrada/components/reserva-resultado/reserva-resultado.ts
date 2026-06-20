import { DatePipe } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { EstadoReserva } from '../../../../../../core/enums/estado-reserva.enum';
import { UiBadge } from '../../../../../../shared/components/badge/badge';
import { UiButton } from '../../../../../../shared/components/button/button';
import { UiModal } from '../../../../../../shared/components/modal/modal';
import { Reserva } from '../../../../core/domain/models/reserva.model';

@Component({
  selector: 'reserva-resultado',
  imports: [DatePipe, RouterLink, UiBadge, UiButton, UiModal],
  template: `
    <div class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h2 class="h5 mb-0">Reserva {{ reserva().codigoReserva ?? reserva().id }}</h2>
          <ui-badge [estado]="reserva().estado" />
        </div>
        <dl class="row mb-3">
          <dt class="col-sm-4">Comprador</dt>
          <dd class="col-sm-8">{{ reserva().nombreComprador }} ({{ reserva().emailComprador }})</dd>
          <dt class="col-sm-4">Cantidad</dt>
          <dd class="col-sm-8">{{ reserva().cantidad }}</dd>
          <dt class="col-sm-4">Fecha de reserva</dt>
          <dd class="col-sm-8">{{ reserva().fechaReserva | date: 'short' }}</dd>
        </dl>

        @if (reserva().estado === estadoReserva.PendientePago) {
          <div class="d-flex gap-2 align-items-center mb-3">
            @if (authService.isAuthenticated()) {
              <ui-button (click)="confirmarPago.emit()" [loading]="confirmando()">Confirmar pago</ui-button>
            } @else {
              <p class="text-muted mb-0 small">El pago será confirmado por un administrador.</p>
            }
            <ui-button variant="outline-secondary" (click)="modalCancelarAbierto.set(true)">Cancelar reserva</ui-button>
          </div>
        }

        <div class="d-flex gap-2 border-top pt-3">
          <ui-button variant="outline-secondary" (click)="nuevaReserva.emit()">Hacer otra reserva</ui-button>
          <a class="btn btn-outline-secondary" routerLink="/eventos">Ir a eventos</a>
        </div>
      </div>
    </div>

    <ui-modal
      [open]="modalCancelarAbierto()"
      title="Cancelar reserva"
      confirmLabel="Sí, cancelar"
      (cancelled)="modalCancelarAbierto.set(false)"
      (confirmed)="onConfirmarCancelacion()"
    >
      ¿Seguro que deseas cancelar esta reserva? Esta acción no se puede revertir.
    </ui-modal>
  `,
})
export class ReservaResultado {
  protected readonly authService = inject(AuthService);
  protected readonly estadoReserva = EstadoReserva;
  protected readonly modalCancelarAbierto = signal(false);

  readonly reserva = input.required<Reserva>();
  readonly confirmando = input(false);

  readonly confirmarPago = output<void>();
  readonly cancelar = output<void>();
  readonly nuevaReserva = output<void>();

  protected onConfirmarCancelacion(): void {
    this.modalCancelarAbierto.set(false);
    this.cancelar.emit();
  }
}
