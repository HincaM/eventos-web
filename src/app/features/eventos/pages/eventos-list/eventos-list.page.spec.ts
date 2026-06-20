import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ListarEventosUseCase } from '../../core/application/use-cases/listar-eventos.use-case';
import { VenueService } from '../../../venues/core/domain/servicios/venue.service';
import { EventosListPage } from './eventos-list.page';

class VenueServiceStub extends VenueService {
  listar() {
    return of([
      { id: 1, nombre: 'Auditorio Central', capacidad: 200, ciudad: 'Bogota' },
      { id: 2, nombre: 'Sala Norte', capacidad: 50, ciudad: 'Bogota' },
    ]);
  }
}

describe('EventosListPage', () => {
  let fixture: ComponentFixture<EventosListPage>;
  let component: EventosListPage;
  let listarEventosUseCase: { execute: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    listarEventosUseCase = { execute: vi.fn().mockReturnValue(of([])) };

    TestBed.configureTestingModule({
      imports: [EventosListPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideNativeDateAdapter(),
        { provide: VenueService, useClass: VenueServiceStub },
        { provide: ListarEventosUseCase, useValue: listarEventosUseCase },
      ],
    });
    fixture = TestBed.createComponent(EventosListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const form = (c: EventosListPage) => (c as unknown as { form: any }).form;
  const submitFiltro = (c: EventosListPage) =>
    (c as unknown as { onFiltrar: (e: SubmitEvent) => void }).onFiltrar(new Event('submit') as SubmitEvent);

  it('carga los venues disponibles para el selector de filtro', () => {
    expect((component as unknown as { venues: () => unknown[] }).venues()).toEqual([
      { id: 1, nombre: 'Auditorio Central', capacidad: 200, ciudad: 'Bogota' },
      { id: 2, nombre: 'Sala Norte', capacidad: 50, ciudad: 'Bogota' },
    ]);
  });

  it('filtra sin venueId ni fechas cuando no se completan', () => {
    submitFiltro(component);

    expect(listarEventosUseCase.execute).toHaveBeenLastCalledWith(
      expect.objectContaining({ venueId: undefined, fechaDesde: undefined, fechaHasta: undefined }),
    );
  });

  it('filtra con el venueId convertido a numero', () => {
    form(component).venueId().value.set('2');

    submitFiltro(component);

    expect(listarEventosUseCase.execute).toHaveBeenLastCalledWith(expect.objectContaining({ venueId: 2 }));
  });

  it('filtra con el rango de fechas seleccionado en el date-range-picker', () => {
    (component as unknown as { onRangoFechas: (r: { desde: string | null; hasta: string | null }) => void })
      .onRangoFechas({ desde: '2026-07-01', hasta: '2026-07-31' });

    submitFiltro(component);

    expect(listarEventosUseCase.execute).toHaveBeenLastCalledWith(
      expect.objectContaining({ fechaDesde: '2026-07-01', fechaHasta: '2026-07-31' }),
    );
  });
});
