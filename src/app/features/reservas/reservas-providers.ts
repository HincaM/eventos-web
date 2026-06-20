import { Provider } from '@angular/core';
import { ReservaService } from './core/domain/servicios/reserva.service';
import { ReservaApiService } from './core/infrastructure/implementations/reserva-api.service';
import { ReservarEntradaUseCase } from './core/application/use-cases/reservar-entrada.use-case';
import { ListarReservasUseCase } from './core/application/use-cases/listar-reservas.use-case';
import { ConfirmarPagoReservaUseCase } from './core/application/use-cases/confirmar-pago-reserva.use-case';
import { CancelarReservaUseCase } from './core/application/use-cases/cancelar-reserva.use-case';

export const RESERVAS_PROVIDERS: Provider[] = [
  { provide: ReservaService, useClass: ReservaApiService },
  ReservarEntradaUseCase,
  ListarReservasUseCase,
  ConfirmarPagoReservaUseCase,
  CancelarReservaUseCase,
];
