import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { UiSpinner } from '../../../../shared/components/spinner/spinner';
import { EventoCard } from './components/evento-card/evento-card';
import { EventoFiltroForm } from './components/evento-filtro-form/evento-filtro-form';
import { ListarEventosFiltro } from '../../core/domain/models-request/listar-eventos.filtro';
import { ListarEventosUseCase } from '../../core/application/use-cases/listar-eventos.use-case';

@Component({
  selector: 'eventos-list-page',
  imports: [AsyncPipe, RouterLink, UiSpinner, EventoCard, EventoFiltroForm],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Eventos</h1>
      <a class="btn btn-primary" routerLink="/eventos/crear"><i class="fa-solid fa-plus me-1"></i>Crear evento</a>
    </div>

    <div class="mb-4">
      <evento-filtro-form (filtroCambiado)="filtro$.next($event)" />
    </div>

    @if (eventos$ | async; as eventos) {
      @if (eventos.length === 0) {
        <p class="text-muted">No se encontraron eventos con los filtros seleccionados.</p>
      } @else {
        <div class="row g-3">
          @for (evento of eventos; track evento.id) {
            <div class="col-md-4">
              <evento-card [evento]="evento" />
            </div>
          }
        </div>
      }
    } @else {
      <ui-spinner />
    }
  `,
})
export class EventosListPage {
  private readonly listarEventosUseCase = inject(ListarEventosUseCase);

  protected readonly filtro$ = new BehaviorSubject<ListarEventosFiltro>({});
  protected readonly eventos$ = this.filtro$.pipe(
    switchMap((filtro) => this.listarEventosUseCase.execute(filtro)),
  );
}
