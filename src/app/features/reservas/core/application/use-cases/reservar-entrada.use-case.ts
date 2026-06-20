import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from '../../domain/models/reserva.model';
import { ReservarEntradaRequest } from '../../domain/models-request/reservar-entrada.request';
import { ReservaService } from '../../domain/servicios/reserva.service';

@Injectable()
export class ReservarEntradaUseCase {
  private readonly reservaService = inject(ReservaService);

  execute(request: ReservarEntradaRequest): Observable<Reserva> {
    return this.reservaService.reservarEntrada(request);
  }
}
