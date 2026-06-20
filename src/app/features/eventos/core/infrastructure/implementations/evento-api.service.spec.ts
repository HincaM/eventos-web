import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TipoEvento } from '../../../../../core/enums/tipo-evento.enum';
import { EstadoEventoActual } from '../../../../../core/enums/estado-evento.enum';
import { CrearEventoRequest } from '../../domain/models-request/crear-evento.request';
import { EventoApiService } from './evento-api.service';

describe('EventoApiService', () => {
  let service: EventoApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventoApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EventoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('crear envia un POST a /eventos/crearEvento con el cuerpo de la peticion', () => {
    const request: CrearEventoRequest = {
      titulo: 'Conferencia',
      descripcion: 'Descripcion de prueba',
      venueId: 1,
      capacidadMaxima: 100,
      fechaInicio: '2026-07-01T10:00:00.000Z',
      fechaFin: '2026-07-01T12:00:00.000Z',
      precio: 50,
      tipo: TipoEvento.Conferencia,
    };

    service.crear(request).subscribe();

    const req = httpMock.expectOne('/eventos/crearEvento');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({});
  });

  it('listar envia un GET a /eventos/listarEventos solo con los filtros provistos', () => {
    service.listar({ tipo: TipoEvento.Taller, estado: EstadoEventoActual.Activo }).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === '/eventos/listarEventos' && r.params.get('Tipo') === TipoEvento.Taller && r.params.get('Estado') === EstadoEventoActual.Activo,
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('Titulo')).toBe(false);
    expect(req.request.params.has('VenueId')).toBe(false);
    expect(req.request.params.has('FechaDesde')).toBe(false);
    req.flush([]);
  });

  it('listarEventos sin filtros no agrega parametros', () => {
    service.listar({}).subscribe();

    const req = httpMock.expectOne('/eventos/listarEventos');
    expect(req.request.params.keys().length).toBe(0);
    req.flush([]);
  });

  it('obtenerReporteOcupacion envia un GET al endpoint de reporte del evento', () => {
    service.obtenerReporteOcupacion('evt-1').subscribe();

    const req = httpMock.expectOne('/eventos/reporte-ocupacion/evt-1');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
