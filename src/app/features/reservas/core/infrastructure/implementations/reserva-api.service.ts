import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from '../../domain/models/reserva.model';
import { ListarReservasFiltro } from '../../domain/models-request/listar-reservas.filtro';
import { ReservarEntradaRequest } from '../../domain/models-request/reservar-entrada.request';
import { ReservaService } from '../../domain/servicios/reserva.service';

@Injectable()
export class ReservaApiService extends ReservaService {
  private readonly http = inject(HttpClient);
  private readonly group = '/reservas';

  reservarEntrada(request: ReservarEntradaRequest): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.group}/reservar-entrada`, request);
  }

  listar(filtro: ListarReservasFiltro): Observable<Reserva[]> {
    let params = new HttpParams();
    if (filtro.eventoId) params = params.set('EventoId', filtro.eventoId);
    if (filtro.estado) params = params.set('Estado', filtro.estado);
    if (filtro.nombreComprador) params = params.set('NombreComprador', filtro.nombreComprador);

    return this.http.get<Reserva[]>(`${this.group}/listarReservas`, { params });
  }

  confirmarPago(reservaId: string): Observable<Reserva> {
    return this.http.patch<Reserva>(`${this.group}/confirmar-pago/${reservaId}`, {});
  }

  cancelar(reservaId: string): Observable<Reserva> {
    return this.http.patch<Reserva>(`${this.group}/cancelar/${reservaId}`, {});
  }
}
