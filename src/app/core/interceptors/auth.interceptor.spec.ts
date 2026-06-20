import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => httpMock.verify());

  it('no agrega Authorization cuando no hay sesion', () => {
    http.get('/eventos').subscribe();

    const req = httpMock.expectOne('/eventos');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('agrega el token como Bearer cuando hay sesion activa', () => {
    authService.login({ username: 'admin', password: 'Admin123!' }).subscribe();
    httpMock.expectOne('/auth/login').flush({ username: 'admin', token: 'token-123', expiraEn: '2026-01-01T00:00:00Z' });

    http.get('/eventos').subscribe();

    const req = httpMock.expectOne('/eventos');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');
    req.flush([]);
  });
});
