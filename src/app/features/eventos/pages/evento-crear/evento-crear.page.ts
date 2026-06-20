import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { EventoForm } from './components/evento-form/evento-form';
import { CrearEventoRequest } from '../../core/domain/models-request/crear-evento.request';
import { CrearEventoUseCase } from '../../core/application/use-cases/crear-evento.use-case';

@Component({
  selector: 'evento-crear-page',
  imports: [EventoForm],
  template: `
    <h1 class="h3 mb-4">Crear evento</h1>
    <evento-form [creating]="creating()" (crear)="onCrear($event)" />
  `,
})
export class EventoCrearPage {
  private readonly crearEventoUseCase = inject(CrearEventoUseCase);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly creating = signal(false);

  protected onCrear(request: CrearEventoRequest): void {
    this.creating.set(true);
    this.crearEventoUseCase.execute(request).subscribe({
      next: (evento) => {
        this.notificationService.show(`Evento "${evento.titulo}" creado correctamente.`, 'success');
        this.router.navigate(['/eventos']);
      },
      error: () => this.creating.set(false),
    });
  }
}
