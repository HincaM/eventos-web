import { EstadoEventoActual } from '../../../../../core/enums/estado-evento.enum';
import { TipoEvento } from '../../../../../core/enums/tipo-evento.enum';

export interface ListarEventosFiltro {
  tipo?: TipoEvento | '';
  fechaDesde?: string;
  fechaHasta?: string;
  venueId?: number;
  estado?: EstadoEventoActual | '';
  titulo?: string;
}
