import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { UiSpinner } from '../../../../shared/components/spinner/spinner';
import { EventoCard } from './components/evento-card/evento-card';
import { EventoFiltroForm } from './components/evento-filtro-form/evento-filtro-form';
import { ListarEventosFiltro } from '../../core/domain/models-request/listar-eventos.filtro';
import { ListarEventosUseCase } from '../../core/application/use-cases/listar-eventos.use-case';

@Component({
  selector: 'eventos-list-page',
  imports: [AsyncPipe, RouterLink, UiSpinner, EventoCard, EventoFiltroForm],
  templateUrl: './eventos-list.page.html',
})
export class EventosListPage {
  private readonly listarEventosUseCase = inject(ListarEventosUseCase);

  protected readonly authService = inject(AuthService);

  protected readonly filtro$ = new BehaviorSubject<ListarEventosFiltro>({});
  protected readonly eventos$ = this.filtro$.pipe(
    switchMap((filtro) => this.listarEventosUseCase.execute(filtro)),
  );
}
