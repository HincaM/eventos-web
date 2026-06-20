import { EstadoReserva } from '../../../../../core/enums/estado-reserva.enum';

export interface ListarReservasFiltro {
  eventoId?: string;
  estado?: EstadoReserva | '';
  nombreComprador?: string;
}
