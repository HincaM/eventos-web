import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { EVENTOS_PROVIDERS } from './features/eventos/eventos-providers';
import { RESERVAS_PROVIDERS } from './features/reservas/reservas-providers';
import { VENUES_PROVIDERS } from './features/venues/venues-providers';

export const routes: Routes = [
  { path: '', redirectTo: 'eventos', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'eventos',
    providers: [...EVENTOS_PROVIDERS, ...VENUES_PROVIDERS],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/eventos/pages/eventos-list/eventos-list.page').then((m) => m.EventosListPage),
      },
      {
        path: 'crear',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/eventos/pages/evento-crear/evento-crear.page').then((m) => m.EventoCrearPage),
      },
      {
        path: ':id/reporte-ocupacion',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/eventos/pages/evento-reporte/evento-reporte.page').then((m) => m.EventoReportePage),
      },
    ],
  },
  {
    path: 'reservas',
    providers: [...RESERVAS_PROVIDERS, ...EVENTOS_PROVIDERS],
    children: [
      {
        path: 'reservar',
        loadComponent: () =>
          import('./features/reservas/pages/reservar-entrada/reservar-entrada.page').then(
            (m) => m.ReservarEntradaPage,
          ),
      },
      {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/reservas/pages/reservas-list/reservas-list.page').then((m) => m.ReservasListPage),
      },
    ],
  },
  { path: '**', redirectTo: 'eventos' },
];
