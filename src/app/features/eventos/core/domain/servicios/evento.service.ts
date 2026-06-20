import { Observable } from 'rxjs';
import { Evento, ReporteOcupacionEvento } from '../models/evento.model';
import { CrearEventoRequest } from '../models-request/crear-evento.request';
import { ListarEventosFiltro } from '../models-request/listar-eventos.filtro';

export abstract class EventoService {
  abstract listar(filtro: ListarEventosFiltro): Observable<Evento[]>;
  abstract crear(request: CrearEventoRequest): Observable<Evento>;
  abstract obtenerReporteOcupacion(eventoId: string): Observable<ReporteOcupacionEvento>;
}
