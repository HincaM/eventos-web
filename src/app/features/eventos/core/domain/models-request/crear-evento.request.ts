import { TipoEvento } from '../../../../../core/enums/tipo-evento.enum';

export interface CrearEventoRequest {
  titulo: string;
  descripcion: string;
  venueId: number;
  capacidadMaxima: number;
  fechaInicio: string;
  fechaFin: string;
  precio: number;
  tipo: TipoEvento;
}
