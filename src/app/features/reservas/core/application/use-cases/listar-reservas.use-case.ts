import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from '../../domain/models/reserva.model';
import { ListarReservasFiltro } from '../../domain/models-request/listar-reservas.filtro';
import { ReservaService } from '../../domain/servicios/reserva.service';

@Injectable()
export class ListarReservasUseCase {
  private readonly reservaService = inject(ReservaService);

  execute(filtro: ListarReservasFiltro): Observable<Reserva[]> {
    return this.reservaService.listar(filtro);
  }
}
