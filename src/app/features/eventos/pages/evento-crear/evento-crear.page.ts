import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormField, form, required, min, schema, submit, validate, minLength, maxLength } from '@angular/forms/signals';
import { NotificationService } from '../../../../core/services/notification.service';
import { TipoEvento } from '../../../../core/enums/tipo-evento.enum';
import { nowAsDatetimeLocalValue, toApiDateTime } from '../../../../core/helpers/datetime.helper';
import { UiButton } from '../../../../shared/components/button/button';
import { UiFormError } from '../../../../shared/components/form-error/form-error';
import { CrearEventoUseCase } from '../../core/application/use-cases/crear-evento.use-case';
import { Venue } from '../../../venues/core/domain/models/venue.model';
import { VenueService } from '../../../venues/core/domain/servicios/venue.service';

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
  minLength(path.titulo, 5, { message: 'El título debe tener al menos 5 caracteres.' });
  maxLength(path.titulo, 100, { message: 'El título debe tener maximo 100 caracteres.' });

  required(path.descripcion, { message: 'La descripción es obligatoria.' });
  minLength(path.descripcion, 10, { message: 'La descripción debe tener al menos 10 caracteres.' });
  maxLength(path.descripcion, 500, { message: 'La descripción debe tener maximo 500 caracteres.' });

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
  selector: 'evento-crear-page',
  imports: [FormField, UiButton, UiFormError],
  templateUrl: './evento-crear.page.html',
})
export class EventoCrearPage {
  private readonly crearEventoUseCase = inject(CrearEventoUseCase);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly venueService = inject(VenueService);

  protected readonly tiposEvento = Object.values(TipoEvento);
  protected readonly venues = signal<Venue[]>([]);
  protected readonly creating = signal(false);

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

  constructor() {
    this.venueService.listar().subscribe((venues) => this.venues.set(venues));
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    void submit(this.form, async (field) => {
      const value = field().value();
      this.creating.set(true);
      this.crearEventoUseCase
        .execute({
          titulo: value.titulo,
          descripcion: value.descripcion,
          venueId: Number(value.venueId),
          capacidadMaxima: value.capacidadMaxima,
          fechaInicio: toApiDateTime(value.fechaInicio),
          fechaFin: toApiDateTime(value.fechaFin),
          precio: value.precio,
          tipo: value.tipo as TipoEvento,
        })
        .subscribe({
          next: (evento) => {
            this.notificationService.show(`Evento "${evento.titulo}" creado correctamente.`, 'success');
            this.router.navigate(['/eventos']);
          },
          error: () => this.creating.set(false),
        });
      return undefined;
    });
  }
}
