import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../../domain/models/evento.model';
import { ListarEventosFiltro } from '../../domain/models-request/listar-eventos.filtro';
import { EventoService } from '../../domain/servicios/evento.service';

@Injectable()
export class ListarEventosUseCase {
  private readonly eventoService = inject(EventoService);

  execute(filtro: ListarEventosFiltro): Observable<Evento[]> {
    return this.eventoService.listar(filtro);
  }
}
