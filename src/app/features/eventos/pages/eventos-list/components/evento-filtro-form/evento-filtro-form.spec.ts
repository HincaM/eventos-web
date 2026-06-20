import { provideNativeDateAdapter } from '@angular/material/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { VenueService } from '../../../../../venues/core/domain/servicios/venue.service';
import { EventoFiltroForm } from './evento-filtro-form';

class VenueServiceStub extends VenueService {
  listar() {
    return of([
      { id: 1, nombre: 'Auditorio Central', capacidad: 200, ciudad: 'Bogota' },
      { id: 2, nombre: 'Sala Norte', capacidad: 50, ciudad: 'Bogota' },
    ]);
  }
}

describe('EventoFiltroForm', () => {
  let fixture: ComponentFixture<EventoFiltroForm>;
  let component: EventoFiltroForm;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventoFiltroForm],
      providers: [
        { provide: VenueService, useClass: VenueServiceStub },
        provideNoopAnimations(),
        provideNativeDateAdapter(),
      ],
    });
    fixture = TestBed.createComponent(EventoFiltroForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const form = (c: EventoFiltroForm) => (c as unknown as { form: any }).form;
  const submitForm = (c: EventoFiltroForm) =>
    (c as unknown as { onSubmit: (e: SubmitEvent) => void }).onSubmit(new Event('submit') as SubmitEvent);

  it('carga los venues disponibles para el selector', () => {
    expect((component as unknown as { venues: () => unknown[] }).venues()).toEqual([
      { id: 1, nombre: 'Auditorio Central', capacidad: 200, ciudad: 'Bogota' },
      { id: 2, nombre: 'Sala Norte', capacidad: 50, ciudad: 'Bogota' },
    ]);
  });

  it('emite el filtro sin venueId ni fechas cuando no se completan', () => {
    const emitido = vi.fn();
    component.filtroCambiado.subscribe(emitido);

    submitForm(component);

    expect(emitido).toHaveBeenCalledWith(
      expect.objectContaining({ venueId: undefined, fechaDesde: undefined, fechaHasta: undefined }),
    );
  });

  it('emite el filtro con el venueId convertido a numero', () => {
    const emitido = vi.fn();
    component.filtroCambiado.subscribe(emitido);
    form(component).venueId().value.set('2');

    submitForm(component);

    expect(emitido).toHaveBeenCalledWith(expect.objectContaining({ venueId: 2 }));
  });

  it('emite el rango de fechas seleccionado en el date-range-picker', () => {
    const emitido = vi.fn();
    component.filtroCambiado.subscribe(emitido);

    (component as unknown as { onRangoFechas: (r: { desde: string | null; hasta: string | null }) => void })
      .onRangoFechas({ desde: '2026-07-01', hasta: '2026-07-31' });

    submitForm(component);

    expect(emitido).toHaveBeenCalledWith(expect.objectContaining({ fechaDesde: '2026-07-01', fechaHasta: '2026-07-31' }));
  });
});
