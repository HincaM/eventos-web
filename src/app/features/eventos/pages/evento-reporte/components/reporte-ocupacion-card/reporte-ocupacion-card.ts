import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { UiBadge } from '../../../../../../shared/components/badge/badge';
import { ReporteOcupacionEvento } from '../../../../core/domain/models/evento.model';

@Component({
  selector: 'reporte-ocupacion-card',
  imports: [CurrencyPipe, UiBadge],
  template: `
    <div class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h5 mb-0">Estado</h2>
          <ui-badge [estado]="reporte().estado" />
        </div>
        <dl class="row mb-0">
          <dt class="col-sm-5">Entradas vendidas</dt>
          <dd class="col-sm-7">{{ reporte().entradasVendidas }}</dd>
          <dt class="col-sm-5">Entradas disponibles</dt>
          <dd class="col-sm-7">{{ reporte().entradasDisponibles }}</dd>
          <dt class="col-sm-5">Porcentaje de ocupación</dt>
          <dd class="col-sm-7">{{ reporte().porcentajeOcupacion }}%</dd>
          <dt class="col-sm-5">Ingresos</dt>
          <dd class="col-sm-7">{{ reporte().ingresos | currency }}</dd>
        </dl>
      </div>
    </div>
  `,
})
export class ReporteOcupacionCard {
  readonly reporte = input.required<ReporteOcupacionEvento>();
}
