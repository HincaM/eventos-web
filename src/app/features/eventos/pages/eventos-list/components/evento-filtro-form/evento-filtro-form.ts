import { Component, inject, output, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { EstadoEventoActual } from '../../../../../../core/enums/estado-evento.enum';
import { TipoEvento } from '../../../../../../core/enums/tipo-evento.enum';
import { UiButton } from '../../../../../../shared/components/button/button';
import { RangoFechas, UiDateRangePicker } from '../../../../../../shared/components/date-range-picker/date-range-picker';
import { ListarEventosFiltro } from '../../../../core/domain/models-request/listar-eventos.filtro';
import { Venue } from '../../../../../venues/core/domain/models/venue.model';
import { VenueService } from '../../../../../venues/core/domain/servicios/venue.service';

interface FiltroFormModel {
  titulo: string;
  tipo: TipoEvento | '';
  estado: EstadoEventoActual | '';
  venueId: string;
}

@Component({
  selector: 'evento-filtro-form',
  imports: [FormField, UiButton, UiDateRangePicker],
  template: `
    <form class="row g-2 align-items-end" (submit)="onSubmit($event)" novalidate>
      <div class="col-md-2">
        <label class="form-label" for="filtroTitulo">Título</label>
        <input id="filtroTitulo" type="text" class="form-control" [formField]="form.titulo" />
      </div>
      <div class="col-md-2">
        <label class="form-label" for="filtroTipo">Tipo</label>
        <select id="filtroTipo" class="form-select" [formField]="form.tipo">
          <option value="">Todos</option>
          @for (tipo of tiposEvento; track tipo) {
            <option [value]="tipo">{{ tipo }}</option>
          }
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label" for="filtroEstado">Estado</label>
        <select id="filtroEstado" class="form-select" [formField]="form.estado">
          <option value="">Todos</option>
          @for (estado of estadosEvento; track estado) {
            <option [value]="estado">{{ estado }}</option>
          }
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label" for="filtroVenue">Venue</label>
        <select id="filtroVenue" class="form-select" [formField]="form.venueId">
          <option value="">Todos</option>
          @for (venue of venues(); track venue.id) {
            <option [value]="venue.id.toString()">{{ venue.nombre }}</option>
          }
        </select>
      </div>
      <div class="col-md-3">
        <ui-date-range-picker label="Rango de inicio" (rangoCambiado)="onRangoFechas($event)" />
      </div>
      <div class="col-md-1">
        <ui-button type="submit">Filtrar</ui-button>
      </div>
    </form>
  `,
})
export class EventoFiltroForm {
  private readonly venueService = inject(VenueService);

  protected readonly tiposEvento = Object.values(TipoEvento);
  protected readonly estadosEvento = Object.values(EstadoEventoActual);
  protected readonly venues = signal<Venue[]>([]);

  readonly filtroCambiado = output<ListarEventosFiltro>();

  protected readonly model = signal<FiltroFormModel>({
    titulo: '',
    tipo: '',
    estado: '',
    venueId: '',
  });

  protected readonly form = form(this.model);

  protected readonly fechaDesde = signal<string | null>(null);
  protected readonly fechaHasta = signal<string | null>(null);

  constructor() {
    this.venueService.listar().subscribe((venues) => this.venues.set(venues));
  }

  protected onRangoFechas(rango: RangoFechas): void {
    this.fechaDesde.set(rango.desde);
    this.fechaHasta.set(rango.hasta);
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const value = this.model();
    this.filtroCambiado.emit({
      ...value,
      venueId: value.venueId ? Number(value.venueId) : undefined,
      fechaDesde: this.fechaDesde() ?? undefined,
      fechaHasta: this.fechaHasta() ?? undefined,
    });
  }
}
