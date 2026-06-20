import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../../domain/models/evento.model';
import { CrearEventoRequest } from '../../domain/models-request/crear-evento.request';
import { EventoService } from '../../domain/servicios/evento.service';

@Injectable()
export class CrearEventoUseCase {
  private readonly eventoService = inject(EventoService);

  execute(request: CrearEventoRequest): Observable<Evento> {
    return this.eventoService.crear(request);
  }
}
