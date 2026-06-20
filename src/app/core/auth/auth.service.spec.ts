import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { LoginResponse } from './auth.models';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('no esta autenticado por defecto', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.token()).toBeNull();
  });

  it('login envia un POST a /auth/login y guarda el token recibido', () => {
    const response: LoginResponse = { username: 'admin', token: 'token-123', expiraEn: '2026-01-01T00:00:00Z' };

    service.login({ username: 'admin', password: 'Admin123!' }).subscribe();

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'admin', password: 'Admin123!' });
    req.flush(response);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.token()).toBe('token-123');
    expect(service.username()).toBe('admin');
  });

  it('logout limpia el token y el estado de autenticacion', () => {
    service.login({ username: 'admin', password: 'Admin123!' }).subscribe();
    httpMock.expectOne('/auth/login').flush({ username: 'admin', token: 'token-123', expiraEn: '2026-01-01T00:00:00Z' });

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.token()).toBeNull();
  });
});
