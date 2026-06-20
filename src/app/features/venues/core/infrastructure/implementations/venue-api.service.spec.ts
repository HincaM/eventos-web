import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { VenueApiService } from './venue-api.service';

describe('VenueApiService', () => {
  let service: VenueApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VenueApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(VenueApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('listar envia un GET a /venues', () => {
    service.listar().subscribe();

    const req = httpMock.expectOne('/venues');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
