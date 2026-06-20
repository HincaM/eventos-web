import { Provider } from '@angular/core';
import { EventoService } from './core/domain/servicios/evento.service';
import { EventoApiService } from './core/infrastructure/implementations/evento-api.service';
import { ListarEventosUseCase } from './core/application/use-cases/listar-eventos.use-case';
import { CrearEventoUseCase } from './core/application/use-cases/crear-evento.use-case';
import { ObtenerReporteOcupacionUseCase } from './core/application/use-cases/obtener-reporte-ocupacion.use-case';

export const EVENTOS_PROVIDERS: Provider[] = [
  { provide: EventoService, useClass: EventoApiService },
  ListarEventosUseCase,
  CrearEventoUseCase,
  ObtenerReporteOcupacionUseCase,
];
