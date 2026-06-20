import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TipoEvento } from '../../../../core/enums/tipo-evento.enum';
import { CrearEventoUseCase } from '../../core/application/use-cases/crear-evento.use-case';
import { VenueService } from '../../../venues/core/domain/servicios/venue.service';
import { EventoCrearPage } from './evento-crear.page';

class VenueServiceStub extends VenueService {
  listar() {
    return of([{ id: 1, nombre: 'Auditorio Central', capacidad: 200, ciudad: 'Bogota' }]);
  }
}

describe('EventoCrearPage', () => {
  let component: EventoCrearPage;
  let crearEventoUseCase: { execute: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    crearEventoUseCase = { execute: vi.fn().mockReturnValue(of({ id: 'evt-1', titulo: 'Conferencia de tecnologia' })) };

    TestBed.configureTestingModule({
      imports: [EventoCrearPage],
      providers: [
        provideRouter([{ path: 'eventos', children: [] }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: VenueService, useClass: VenueServiceStub },
        { provide: CrearEventoUseCase, useValue: crearEventoUseCase },
      ],
    });
    const fixture = TestBed.createComponent(EventoCrearPage);
    component = fixture.componentInstance;
  });

  const form = (c: EventoCrearPage) => (c as unknown as { form: any }).form;

  it('es invalido cuando los campos obligatorios estan vacios', () => {
    expect(form(component)().valid()).toBe(false);
    expect(form(component).titulo().errors().length).toBeGreaterThan(0);
    expect(form(component).descripcion().errors().length).toBeGreaterThan(0);
    expect(form(component).tipo().errors().length).toBeGreaterThan(0);
  });

  it('marca el venue como invalido cuando no se selecciona ninguno (valor "0")', () => {
    expect(form(component).venueId().errors().length).toBeGreaterThan(0);
  });

  it('rechaza una capacidad maxima no positiva', () => {
    form(component).capacidadMaxima().value.set(0);

    expect(form(component).capacidadMaxima().errors().length).toBeGreaterThan(0);
  });

  it('rechaza un precio no positivo', () => {
    form(component).precio().value.set(0);

    expect(form(component).precio().errors().length).toBeGreaterThan(0);
  });

  it('rechaza una fecha de fin anterior o igual a la fecha de inicio', () => {
    form(component).fechaInicio().value.set('2026-07-01T10:00');
    form(component).fechaFin().value.set('2026-07-01T09:00');

    expect(form(component).fechaFin().errors().length).toBeGreaterThan(0);
  });

  it('es valido cuando todos los campos cumplen las reglas y crea el evento al enviar', async () => {
    form(component).titulo().value.set('Conferencia de tecnologia');
    form(component).descripcion().value.set('Una descripcion valida para el evento.');
    form(component).venueId().value.set('1');
    form(component).capacidadMaxima().value.set(100);
    form(component).precio().value.set(50);
    form(component).tipo().value.set(TipoEvento.Conferencia);
    form(component).fechaInicio().value.set('2026-07-01T10:00');
    form(component).fechaFin().value.set('2026-07-01T12:00');

    expect(form(component)().valid()).toBe(true);

    (component as unknown as { onSubmit: (e: SubmitEvent) => void }).onSubmit(new Event('submit') as SubmitEvent);
    await Promise.resolve();

    expect(crearEventoUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ titulo: 'Conferencia de tecnologia', venueId: 1, tipo: TipoEvento.Conferencia }),
    );
  });
});
