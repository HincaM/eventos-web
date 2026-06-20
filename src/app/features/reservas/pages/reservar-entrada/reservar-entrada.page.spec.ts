import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Signal, WritableSignal } from '@angular/core';
import { of } from 'rxjs';
import { EstadoEventoActual } from '../../../../core/enums/estado-evento.enum';
import { Evento } from '../../../eventos/core/domain/models/evento.model';
import { ListarEventosUseCase } from '../../../eventos/core/application/use-cases/listar-eventos.use-case';
import { ReservarEntradaUseCase } from '../../core/application/use-cases/reservar-entrada.use-case';
import { ConfirmarPagoReservaUseCase } from '../../core/application/use-cases/confirmar-pago-reserva.use-case';
import { CancelarReservaUseCase } from '../../core/application/use-cases/cancelar-reserva.use-case';
import { ReservarEntradaPage } from './reservar-entrada.page';

const evento: Evento = {
  id: 'evt-1',
  titulo: 'Conferencia de tecnologia',
  descripcion: 'desc',
  venueId: 1,
  capacidadMaxima: 100,
  fechaInicio: '2026-07-01T10:00:00Z',
  fechaFin: '2026-07-01T12:00:00Z',
  precio: 50,
  tipo: 'Conferencia',
  estado: 'Activo',
};

interface InternalsAccess {
  form: any;
  reserva: Signal<unknown>;
  eventoIdEfectivo: Signal<string | null>;
  eventoSeleccionadoManualmente: WritableSignal<string | null>;
  onSubmitReserva: (e: SubmitEvent) => void;
  onNuevaReserva: () => void;
}

describe('ReservarEntradaPage', () => {
  let fixture: ComponentFixture<ReservarEntradaPage>;
  let component: ReservarEntradaPage;
  let internals: InternalsAccess;
  let listarEventosUseCase: { execute: ReturnType<typeof vi.fn> };
  let reservarEntradaUseCase: { execute: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    listarEventosUseCase = { execute: vi.fn().mockReturnValue(of([evento])) };
    reservarEntradaUseCase = {
      execute: vi.fn().mockReturnValue(of({ id: 'res-1', estado: 'PendientePago' })),
    };

    TestBed.configureTestingModule({
      imports: [ReservarEntradaPage],
      providers: [
        { provide: ListarEventosUseCase, useValue: listarEventosUseCase },
        { provide: ReservarEntradaUseCase, useValue: reservarEntradaUseCase },
        { provide: ConfirmarPagoReservaUseCase, useValue: { execute: vi.fn() } },
        { provide: CancelarReservaUseCase, useValue: { execute: vi.fn() } },
      ],
    });
    fixture = TestBed.createComponent(ReservarEntradaPage);
    component = fixture.componentInstance;
    internals = component as unknown as InternalsAccess;
    fixture.detectChanges();
  });

  const submitReserva = () => internals.onSubmitReserva(new Event('submit') as SubmitEvent);

  it('solicita los eventos activos para el selector cuando no hay eventoId', () => {
    expect(listarEventosUseCase.execute).toHaveBeenCalledWith({ estado: EstadoEventoActual.Activo });
    expect(internals.eventoIdEfectivo()).toBeNull();
  });

  it('al seleccionar un evento muestra el formulario de reserva', () => {
    internals.eventoSeleccionadoManualmente.set('evt-1');

    expect(internals.eventoIdEfectivo()).toBe('evt-1');
  });

  it('rechaza una cantidad menor a 1', () => {
    internals.form.cantidad().value.set(0);

    expect(internals.form.cantidad().errors().length).toBeGreaterThan(0);
  });

  it('exige el nombre del comprador', () => {
    expect(internals.form.nombreComprador().errors().length).toBeGreaterThan(0);
  });

  it('rechaza un email con formato invalido', () => {
    internals.form.emailComprador().value.set('no-es-un-email');

    expect(internals.form.emailComprador().errors().length).toBeGreaterThan(0);
  });

  it('reserva la entrada con el eventoId efectivo y muestra el resultado', () => {
    internals.eventoSeleccionadoManualmente.set('evt-1');
    internals.form.cantidad().value.set(3);
    internals.form.nombreComprador().value.set('Juan Perez');
    internals.form.emailComprador().value.set('juan@test.com');

    submitReserva();

    expect(reservarEntradaUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ eventoId: 'evt-1', cantidad: 3, nombreComprador: 'Juan Perez' }),
    );
    expect(internals.reserva()).toEqual({ id: 'res-1', estado: 'PendientePago' });
  });

  it('al hacer otra reserva vuelve al selector y reinicia el formulario', () => {
    internals.eventoSeleccionadoManualmente.set('evt-1');
    internals.form.cantidad().value.set(5);
    internals.form.nombreComprador().value.set('Juan Perez');
    internals.form.emailComprador().value.set('juan@test.com');
    submitReserva();
    expect(internals.reserva()).not.toBeNull();

    internals.onNuevaReserva();

    expect(internals.reserva()).toBeNull();
    expect(internals.eventoIdEfectivo()).toBeNull();
    expect(internals.form.cantidad().value()).toBe(1);
  });
});
