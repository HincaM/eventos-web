import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from '../../domain/models/reserva.model';
import { ReservaService } from '../../domain/servicios/reserva.service';

@Injectable()
export class ConfirmarPagoReservaUseCase {
  private readonly reservaService = inject(ReservaService);

  execute(reservaId: string): Observable<Reserva> {
    return this.reservaService.confirmarPago(reservaId);
  }
}
