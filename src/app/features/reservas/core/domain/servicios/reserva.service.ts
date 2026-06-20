import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';
import { ListarReservasFiltro } from '../models-request/listar-reservas.filtro';
import { ReservarEntradaRequest } from '../models-request/reservar-entrada.request';

export abstract class ReservaService {
  abstract reservarEntrada(request: ReservarEntradaRequest): Observable<Reserva>;
  abstract listar(filtro: ListarReservasFiltro): Observable<Reserva[]>;
  abstract confirmarPago(reservaId: string): Observable<Reserva>;
  abstract cancelar(reservaId: string): Observable<Reserva>;
}
