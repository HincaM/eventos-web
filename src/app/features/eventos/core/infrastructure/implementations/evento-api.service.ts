import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento, ReporteOcupacionEvento } from '../../domain/models/evento.model';
import { CrearEventoRequest } from '../../domain/models-request/crear-evento.request';
import { ListarEventosFiltro } from '../../domain/models-request/listar-eventos.filtro';
import { EventoService } from '../../domain/servicios/evento.service';

@Injectable()
export class EventoApiService extends EventoService {
  private readonly http = inject(HttpClient);
  private readonly group = '/eventos';

  listar(filtro: ListarEventosFiltro): Observable<Evento[]> {
    let params = new HttpParams();
    if (filtro.tipo) params = params.set('Tipo', filtro.tipo);
    if (filtro.estado) params = params.set('Estado', filtro.estado);
    if (filtro.titulo) params = params.set('Titulo', filtro.titulo);
    if (filtro.venueId) params = params.set('VenueId', filtro.venueId);
    if (filtro.fechaDesde) params = params.set('FechaDesde', filtro.fechaDesde);
    if (filtro.fechaHasta) params = params.set('FechaHasta', filtro.fechaHasta);

    return this.http.get<Evento[]>(`${this.group}/listarEventos`, { params });
  }

  crear(request: CrearEventoRequest): Observable<Evento> {
    return this.http.post<Evento>(`${this.group}/crearEvento`, request);
  }

  obtenerReporteOcupacion(eventoId: string): Observable<ReporteOcupacionEvento> {
    return this.http.get<ReporteOcupacionEvento>(`${this.group}/reporte-ocupacion/${eventoId}`);
  }
}
