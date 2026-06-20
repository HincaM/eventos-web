import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { UiBadge } from '../../../../shared/components/badge/badge';
import { UiSpinner } from '../../../../shared/components/spinner/spinner';
import { ObtenerReporteOcupacionUseCase } from '../../core/application/use-cases/obtener-reporte-ocupacion.use-case';

@Component({
  selector: 'evento-reporte-page',
  imports: [AsyncPipe, CurrencyPipe, UiBadge, UiSpinner],
  templateUrl: './evento-reporte.page.html',
})
export class EventoReportePage {
  private readonly obtenerReporteOcupacionUseCase = inject(ObtenerReporteOcupacionUseCase);

  readonly id = input.required<string>();

  protected readonly reporte$ = toObservable(this.id).pipe(
    switchMap((id) => this.obtenerReporteOcupacionUseCase.execute(id)),
  );
}
