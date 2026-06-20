import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ReporteOcupacionEvento } from '../../domain/models/evento.model';
import { EventoService } from '../../domain/servicios/evento.service';

@Injectable()
export class ObtenerReporteOcupacionUseCase {
  private readonly eventoService = inject(EventoService);

  execute(eventoId: string): Observable<ReporteOcupacionEvento> {
    return this.eventoService.obtenerReporteOcupacion(eventoId);
  }
}
