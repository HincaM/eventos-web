import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from '../../domain/models/reserva.model';
import { ReservarEntradaRequest } from '../../domain/models-request/reservar-entrada.request';
import { ReservaService } from '../../domain/servicios/reserva.service';

@Injectable()
export class ReservaApiService extends ReservaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/reservas';

  reservarEntrada(request: ReservarEntradaRequest): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.baseUrl}/reservar-entrada`, request);
  }

  confirmarPago(reservaId: string): Observable<Reserva> {
    return this.http.patch<Reserva>(`${this.baseUrl}/confirmar-pago/${reservaId}`, {});
  }

  cancelar(reservaId: string): Observable<Reserva> {
    return this.http.patch<Reserva>(`${this.baseUrl}/cancelar/${reservaId}`, {});
  }
}
