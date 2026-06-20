import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { FormField, form } from '@angular/forms/signals';
import { AuthService } from '../../../../core/auth/auth.service';
import { EstadoEventoActual } from '../../../../core/enums/estado-evento.enum';
import { TipoEvento } from '../../../../core/enums/tipo-evento.enum';
import { UiButton } from '../../../../shared/components/button/button';
import { RangoFechas, UiDateRangePicker } from '../../../../shared/components/date-range-picker/date-range-picker';
import { UiSelect } from '../../../../shared/components/select/select';
import { UiSpinner } from '../../../../shared/components/spinner/spinner';
import { EventoCard } from './components/evento-card/evento-card';
import { Evento } from '../../core/domain/models/evento.model';
import { ListarEventosFiltro } from '../../core/domain/models-request/listar-eventos.filtro';
import { ListarEventosUseCase } from '../../core/application/use-cases/listar-eventos.use-case';
import { Venue } from '../../../venues/core/domain/models/venue.model';
import { VenueService } from '../../../venues/core/domain/servicios/venue.service';

interface FiltroFormModel {
  titulo: string;
  tipo: TipoEvento | '';
  estado: EstadoEventoActual | '';
  venueId: string;
}

@Component({
  selector: 'eventos-list-page',
  imports: [RouterLink, FormField, UiButton, UiDateRangePicker, UiSelect, UiSpinner, EventoCard],
  templateUrl: './eventos-list.page.html',
})
export class EventosListPage {
  private readonly listarEventosUseCase = inject(ListarEventosUseCase);
  private readonly venueService = inject(VenueService);

  protected readonly authService = inject(AuthService);

  protected readonly tiposEvento = Object.values(TipoEvento);
  protected readonly estadosEvento = Object.values(EstadoEventoActual);
  protected readonly identidad = (valor: string) => valor;
  protected readonly venueCodigo = (venue: Venue) => venue.id.toString();
  protected readonly venueDescripcion = (venue: Venue) => venue.nombre;
  protected readonly venues = signal<Venue[]>([]);

  protected readonly model = signal<FiltroFormModel>({ titulo: '', tipo: '', estado: '', venueId: '' });
  protected readonly form = form(this.model);

  protected readonly fechaDesde = signal<string | null>(null);
  protected readonly fechaHasta = signal<string | null>(null);

  protected readonly filtro$ = new BehaviorSubject<ListarEventosFiltro>({});
  protected readonly eventos = signal<Evento[] | null>(null);

  constructor() {
    this.venueService.listar().subscribe((venues) => this.venues.set(venues));

    this.filtro$
      .pipe(
        switchMap((filtro) => {
          this.eventos.set(null);
          return this.listarEventosUseCase.execute(filtro);
        }),
      )
      .subscribe((eventos) => this.eventos.set(eventos));
  }

  protected onRangoFechas(rango: RangoFechas): void {
    this.fechaDesde.set(rango.desde);
    this.fechaHasta.set(rango.hasta);
  }

  protected onFiltrar(event: SubmitEvent): void {
    event.preventDefault();
    const value = this.model();
    this.filtro$.next({
      ...value,
      venueId: value.venueId ? Number(value.venueId) : undefined,
      fechaDesde: this.fechaDesde() ?? undefined,
      fechaHasta: this.fechaHasta() ?? undefined,
    });
  }
}
