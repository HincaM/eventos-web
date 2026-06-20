import { Component, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { UiSelect } from '../../../../shared/components/select/select';
import { UiSpinner } from '../../../../shared/components/spinner/spinner';
import { Evento, ReporteOcupacionEvento } from '../../core/domain/models/evento.model';
import { EventoService } from '../../core/domain/servicios/evento.service';
import { ObtenerReporteOcupacionUseCase } from '../../core/application/use-cases/obtener-reporte-ocupacion.use-case';
import { ReporteOcupacionCard } from '../evento-reporte/components/reporte-ocupacion-card/reporte-ocupacion-card';

interface FiltroFormModel {
  eventoId: string;
}

@Component({
  selector: 'eventos-reportes-page',
  imports: [FormField, ReporteOcupacionCard, UiSelect, UiSpinner],
  templateUrl: './eventos-reportes.page.html',
})
export class EventosReportesPage {
  private readonly eventoService = inject(EventoService);
  private readonly obtenerReporteOcupacionUseCase = inject(ObtenerReporteOcupacionUseCase);

  protected readonly eventoCodigo = (evento: Evento) => evento.id;
  protected readonly eventoDescripcion = (evento: Evento) => evento.titulo;
  protected readonly eventos = signal<Evento[]>([]);

  protected readonly model = signal<FiltroFormModel>({ eventoId: '' });
  protected readonly form = form(this.model);

  protected readonly reporte = signal<ReporteOcupacionEvento | null>(null);

  constructor() {
    this.eventoService.listar({}).subscribe((eventos) => this.eventos.set(eventos));

    toObservable(this.model)
      .pipe(
        switchMap((model) => {
          this.reporte.set(null);
          if (!model.eventoId) return [];
          return this.obtenerReporteOcupacionUseCase.execute(model.eventoId);
        }),
      )
      .subscribe((reporte) => this.reporte.set(reporte));
  }
}
