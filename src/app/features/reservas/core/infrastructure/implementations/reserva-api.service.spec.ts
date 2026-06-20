import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ReservarEntradaRequest } from '../../domain/models-request/reservar-entrada.request';
import { ReservaApiService } from './reserva-api.service';

describe('ReservaApiService', () => {
  let service: ReservaApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReservaApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ReservaApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('reservarEntrada envia un POST con los datos de la reserva', () => {
    const request: ReservarEntradaRequest = {
      eventoId: 'evt-1',
      cantidad: 2,
      nombreComprador: 'Juan Perez',
      emailComprador: 'juan@test.com',
    };

    service.reservarEntrada(request).subscribe();

    const req = httpMock.expectOne('/reservas/reservar-entrada');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({});
  });

  it('confirmarPago envia un PATCH al endpoint de la reserva', () => {
    service.confirmarPago('res-1').subscribe();

    const req = httpMock.expectOne('/reservas/confirmar-pago/res-1');
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('cancelar envia un PATCH al endpoint de cancelacion de la reserva', () => {
    service.cancelar('res-1').subscribe();

    const req = httpMock.expectOne('/reservas/cancelar/res-1');
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });
});
