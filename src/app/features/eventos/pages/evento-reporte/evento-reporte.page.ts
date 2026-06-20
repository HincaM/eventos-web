import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { UiBadge } from '../../../../shared/components/badge/badge';
import { UiSpinner } from '../../../../shared/components/spinner/spinner';
import { ReporteOcupacionEvento } from '../../core/domain/models/evento.model';
import { ObtenerReporteOcupacionUseCase } from '../../core/application/use-cases/obtener-reporte-ocupacion.use-case';

@Component({
  selector: 'evento-reporte-page',
  imports: [CurrencyPipe, UiBadge, UiSpinner],
  templateUrl: './evento-reporte.page.html',
})
export class EventoReportePage {
  private readonly obtenerReporteOcupacionUseCase = inject(ObtenerReporteOcupacionUseCase);

  readonly id = input.required<string>();

  protected readonly reporte = signal<ReporteOcupacionEvento | null>(null);

  constructor() {
    toObservable(this.id)
      .pipe(
        switchMap((id) => {
          this.reporte.set(null);
          return this.obtenerReporteOcupacionUseCase.execute(id);
        }),
      )
      .subscribe((reporte) => this.reporte.set(reporte));
  }
}
