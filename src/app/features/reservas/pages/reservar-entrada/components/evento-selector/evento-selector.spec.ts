import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EstadoEventoActual } from '../../../../../../core/enums/estado-evento.enum';
import { Evento } from '../../../../../eventos/core/domain/models/evento.model';
import { ListarEventosUseCase } from '../../../../../eventos/core/application/use-cases/listar-eventos.use-case';
import { EventoSelector } from './evento-selector';

describe('EventoSelector', () => {
  let fixture: ComponentFixture<EventoSelector>;
  let component: EventoSelector;
  let listarEventosUseCase: { execute: ReturnType<typeof vi.fn> };

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

  beforeEach(() => {
    listarEventosUseCase = { execute: vi.fn().mockReturnValue(of([evento])) };

    TestBed.configureTestingModule({
      imports: [EventoSelector],
      providers: [{ provide: ListarEventosUseCase, useValue: listarEventosUseCase }],
    });
    fixture = TestBed.createComponent(EventoSelector);
    component = fixture.componentInstance;
  });

  it('solicita los eventos activos al use case', () => {
    fixture.detectChanges();

    expect(listarEventosUseCase.execute).toHaveBeenCalledWith({ estado: EstadoEventoActual.Activo });
  });

  it('emite el id del evento seleccionado', () => {
    fixture.detectChanges();
    const seleccionado = vi.fn();
    component.eventoSeleccionado.subscribe(seleccionado);

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = 'evt-1';
    select.dispatchEvent(new Event('change'));

    expect(seleccionado).toHaveBeenCalledWith('evt-1');
  });

  it('no emite nada si se vuelve a la opcion vacia', () => {
    fixture.detectChanges();
    const seleccionado = vi.fn();
    component.eventoSeleccionado.subscribe(seleccionado);

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = '';
    select.dispatchEvent(new Event('change'));

    expect(seleccionado).not.toHaveBeenCalled();
  });
});
