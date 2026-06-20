export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  venueId: number;
  capacidadMaxima: number;
  fechaInicio: string;
  fechaFin: string;
  precio: number;
  tipo: string;
  estado: string;
}

export interface ReporteOcupacionEvento {
  eventoId: string;
  entradasVendidas: number;
  entradasDisponibles: number;
  porcentajeOcupacion: number;
  ingresos: number;
  estado: string;
}
