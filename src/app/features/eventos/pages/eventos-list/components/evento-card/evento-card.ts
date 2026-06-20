import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { Evento } from '../../../../core/domain/models/evento.model';
import { UiBadge } from '../../../../../../shared/components/badge/badge';

@Component({
  selector: 'evento-card',
  imports: [RouterLink, CurrencyPipe, DatePipe, UiBadge],
  template: `
    <div class="card h-100">
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h3 class="h5 mb-0">{{ evento().titulo }}</h3>
          <ui-badge [estado]="evento().estado" />
        </div>
        <p class="text-muted small mb-2">
          <i class="fa-solid fa-tag me-1"></i>{{ evento().tipo }}
        </p>
        <p class="card-text flex-grow-1">{{ evento().descripcion }}</p>
        <p class="mb-1">
          <i class="fa-regular fa-calendar me-1"></i>
          {{ evento().fechaInicio | date: 'short' }} — {{ evento().fechaFin | date: 'short' }}
        </p>
        <p class="mb-3">
          <i class="fa-solid fa-tag me-1"></i>{{ evento().precio | currency }}
          <span class="ms-3"><i class="fa-solid fa-users me-1"></i>{{ evento().capacidadMaxima }}</span>
        </p>
        <div class="d-flex gap-2">
          @if (authService.isAuthenticated()) {
            <a class="btn btn-outline-secondary btn-sm" [routerLink]="['/eventos', evento().id, 'reporte-ocupacion']">
              <i class="fa-solid fa-chart-pie me-1"></i>Reporte
            </a>
          }
          <a class="btn btn-primary btn-sm" [routerLink]="['/reservas', 'reservar']" [queryParams]="{ eventoId: evento().id }">
            <i class="fa-solid fa-ticket me-1"></i>Reservar
          </a>
        </div>
      </div>
    </div>
  `,
})
export class EventoCard {
  protected readonly authService = inject(AuthService);

  readonly evento = input.required<Evento>();
}
