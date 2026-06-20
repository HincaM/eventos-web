import { Component, output, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { EstadoEventoActual } from '../../../../../../core/enums/estado-evento.enum';
import { TipoEvento } from '../../../../../../core/enums/tipo-evento.enum';
import { UiButton } from '../../../../../../shared/components/button/button';
import { ListarEventosFiltro } from '../../../../core/domain/models-request/listar-eventos.filtro';

interface FiltroFormModel {
  titulo: string;
  tipo: TipoEvento | '';
  estado: EstadoEventoActual | '';
  fechaDesde: string;
}

@Component({
  selector: 'evento-filtro-form',
  imports: [FormField, UiButton],
  template: `
    <form class="row g-2 align-items-end" (submit)="onSubmit($event)" novalidate>
      <div class="col-md-3">
        <label class="form-label" for="filtroTitulo">Título</label>
        <input id="filtroTitulo" type="text" class="form-control" [formField]="form.titulo" />
      </div>
      <div class="col-md-3">
        <label class="form-label" for="filtroTipo">Tipo</label>
        <select id="filtroTipo" class="form-select" [formField]="form.tipo">
          <option value="">Todos</option>
          @for (tipo of tiposEvento; track tipo) {
            <option [value]="tipo">{{ tipo }}</option>
          }
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label" for="filtroEstado">Estado</label>
        <select id="filtroEstado" class="form-select" [formField]="form.estado">
          <option value="">Todos</option>
          @for (estado of estadosEvento; track estado) {
            <option [value]="estado">{{ estado }}</option>
          }
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label" for="filtroFechaDesde">Desde</label>
        <input id="filtroFechaDesde" type="date" class="form-control" [formField]="form.fechaDesde" />
      </div>
      <div class="col-md-1">
        <ui-button type="submit">Filtrar</ui-button>
      </div>
    </form>
  `,
})
export class EventoFiltroForm {
  protected readonly tiposEvento = Object.values(TipoEvento);
  protected readonly estadosEvento = Object.values(EstadoEventoActual);

  readonly filtroCambiado = output<ListarEventosFiltro>();

  protected readonly model = signal<FiltroFormModel>({
    titulo: '',
    tipo: '',
    estado: '',
    fechaDesde: '',
  });

  protected readonly form = form(this.model);

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.filtroCambiado.emit(this.model());
  }
}
