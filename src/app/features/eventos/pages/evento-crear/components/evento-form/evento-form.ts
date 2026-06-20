import { Component, inject, input, output, signal } from '@angular/core';
import { FormField, form, required, min, schema, submit, validate } from '@angular/forms/signals';
import { TipoEvento } from '../../../../../../core/enums/tipo-evento.enum';
import { nowAsDatetimeLocalValue, toApiDateTime } from '../../../../../../core/helpers/datetime.helper';
import { UiButton } from '../../../../../../shared/components/button/button';
import { UiFormError } from '../../../../../../shared/components/form-error/form-error';
import { CrearEventoRequest } from '../../../../core/domain/models-request/crear-evento.request';
import { Venue } from '../../../../../venues/core/domain/models/venue.model';
import { VenueService } from '../../../../../venues/core/domain/servicios/venue.service';

interface CrearEventoFormModel {
  titulo: string;
  descripcion: string;
  venueId: string;
  capacidadMaxima: number;
  fechaInicio: string;
  fechaFin: string;
  precio: number;
  tipo: TipoEvento | '';
}

const crearEventoSchema = schema<CrearEventoFormModel>((path) => {
  required(path.titulo, { message: 'El título es obligatorio.' });
  required(path.descripcion, { message: 'La descripción es obligatoria.' });
  required(path.tipo, { message: 'Selecciona un tipo de evento.' });
  validate(path.venueId, ({ value }) => (value() === '0' ? { kind: 'venue-requerido', message: 'Selecciona un venue válido.' } : undefined));
  min(path.capacidadMaxima, 1, { message: 'La capacidad debe ser mayor a 0.' });
  min(path.precio, 0.01, { message: 'El precio debe ser mayor a 0.' });
  required(path.fechaInicio, { message: 'La fecha de inicio es obligatoria.' });
  required(path.fechaFin, { message: 'La fecha de fin es obligatoria.' });
  validate(path.fechaFin, ({ value, valueOf }) => {
    const inicio = valueOf(path.fechaInicio);
    if (inicio && value() && new Date(value()) <= new Date(inicio)) {
      return { kind: 'rango-fechas', message: 'La fecha de fin debe ser posterior a la fecha de inicio.' };
    }
    return undefined;
  });
});

@Component({
  selector: 'evento-form',
  imports: [FormField, UiButton, UiFormError],
  template: `
    <form (submit)="onSubmit($event)" novalidate>
      <div class="mb-3">
        <label class="form-label" for="titulo">Título</label>
        <input id="titulo" type="text" class="form-control" [formField]="form.titulo" />
        <ui-form-error [errors]="form.titulo().errors()" [touched]="form.titulo().touched()" />
      </div>

      <div class="mb-3">
        <label class="form-label" for="descripcion">Descripción</label>
        <textarea id="descripcion" class="form-control" rows="3" [formField]="form.descripcion"></textarea>
        <ui-form-error [errors]="form.descripcion().errors()" [touched]="form.descripcion().touched()" />
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label" for="venueId">Venue</label>
          <select id="venueId" class="form-select" [formField]="form.venueId">
            <option value="0">Selecciona un venue</option>
            @for (venue of venues(); track venue.id) {
              <option [value]="venue.id.toString()">{{ venue.nombre }}</option>
            }
          </select>
          <ui-form-error [errors]="form.venueId().errors()" [touched]="form.venueId().touched()" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label" for="capacidadMaxima">Capacidad máxima</label>
          <input id="capacidadMaxima" type="number" class="form-control" [formField]="form.capacidadMaxima" />
          <ui-form-error [errors]="form.capacidadMaxima().errors()" [touched]="form.capacidadMaxima().touched()" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label" for="fechaInicio">Fecha de inicio</label>
          <input id="fechaInicio" type="datetime-local" class="form-control" [formField]="form.fechaInicio" />
          <ui-form-error [errors]="form.fechaInicio().errors()" [touched]="form.fechaInicio().touched()" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label" for="fechaFin">Fecha de fin</label>
          <input id="fechaFin" type="datetime-local" class="form-control" [formField]="form.fechaFin" />
          <ui-form-error [errors]="form.fechaFin().errors()" [touched]="form.fechaFin().touched()" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label" for="precio">Precio</label>
          <input id="precio" type="number" step="0.01" class="form-control" [formField]="form.precio" />
          <ui-form-error [errors]="form.precio().errors()" [touched]="form.precio().touched()" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label" for="tipo">Tipo</label>
          <select id="tipo" class="form-select" [formField]="form.tipo">
            <option value="">Selecciona un tipo</option>
            @for (tipo of tiposEvento; track tipo) {
              <option [value]="tipo">{{ tipo }}</option>
            }
          </select>
          <ui-form-error [errors]="form.tipo().errors()" [touched]="form.tipo().touched()" />
        </div>
      </div>

      <ui-button type="submit" [loading]="creating()">Crear evento</ui-button>
    </form>
  `,
})
export class EventoForm {
  private readonly venueService = inject(VenueService);

  protected readonly tiposEvento = Object.values(TipoEvento);
  protected readonly venues = signal<Venue[]>([]);

  readonly creating = input(false);
  readonly crear = output<CrearEventoRequest>();

  constructor() {
    this.venueService.listar().subscribe((venues) => this.venues.set(venues));
  }

  protected readonly model = signal<CrearEventoFormModel>({
    titulo: '',
    descripcion: '',
    venueId: '0',
    capacidadMaxima: 1,
    fechaInicio: nowAsDatetimeLocalValue(),
    fechaFin: nowAsDatetimeLocalValue(),
    precio: 1,
    tipo: '',
  });

  protected readonly form = form(this.model, crearEventoSchema);

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    void submit(this.form, async (field) => {
      const value = field().value();
      this.crear.emit({
        titulo: value.titulo,
        descripcion: value.descripcion,
        venueId: Number(value.venueId),
        capacidadMaxima: value.capacidadMaxima,
        fechaInicio: toApiDateTime(value.fechaInicio),
        fechaFin: toApiDateTime(value.fechaFin),
        precio: value.precio,
        tipo: value.tipo as TipoEvento,
      });
      return undefined;
    });
  }
}
