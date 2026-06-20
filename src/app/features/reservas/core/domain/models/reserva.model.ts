export interface Reserva {
  id: string;
  eventoId: string;
  cantidad: number;
  nombreComprador: string;
  emailComprador: string;
  estado: string;
  codigoReserva: string | null;
  fechaReserva: string;
  fechaCancelacion: string | null;
}
