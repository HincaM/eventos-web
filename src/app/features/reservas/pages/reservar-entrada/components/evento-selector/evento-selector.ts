import { AsyncPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { EstadoEventoActual } from '../../../../../../core/enums/estado-evento.enum';
import { ListarEventosUseCase } from '../../../../../eventos/core/application/use-cases/listar-eventos.use-case';

@Component({
  selector: 'evento-selector',
  imports: [AsyncPipe],
  template: `
    <div class="card">
      <div class="card-body">
        <h2 class="h5 mb-3">Selecciona un evento para reservar</h2>
        @if (eventos$ | async; as eventos) {
          @if (eventos.length === 0) {
            <p class="text-muted mb-0">No hay eventos activos disponibles.</p>
          } @else {
            <select class="form-select" (change)="onSeleccionar($event)">
              <option value="">Selecciona un evento</option>
              @for (evento of eventos; track evento.id) {
                <option [value]="evento.id">{{ evento.titulo }}</option>
              }
            </select>
          }
        }
      </div>
    </div>
  `,
})
export class EventoSelector {
  private readonly listarEventosUseCase = inject(ListarEventosUseCase);

  readonly eventoSeleccionado = output<string>();

  protected readonly eventos$ = this.listarEventosUseCase.execute({ estado: EstadoEventoActual.Activo });

  protected onSeleccionar(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    if (id) {
      this.eventoSeleccionado.emit(id);
    }
  }
}
