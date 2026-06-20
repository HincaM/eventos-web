import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  const runGuard = (url: string) => TestBed.runInInjectionContext(() => authGuard({} as never, { url } as never));

  it('permite el acceso cuando el administrador esta autenticado', () => {
    authService.login({ username: 'admin', password: 'Admin123!' }).subscribe();
    httpMock.expectOne('/auth/login').flush({ username: 'admin', token: 'token-123', expiraEn: '2026-01-01T00:00:00Z' });

    const resultado = runGuard('/eventos/crear');

    expect(resultado).toBe(true);
  });

  it('redirige a /login con returnUrl cuando no hay sesion', () => {
    const resultado = runGuard('/eventos/crear');

    expect(resultado).not.toBe(true);
    const urlTree = resultado as UrlTree;
    expect(router.serializeUrl(urlTree)).toBe('/login?returnUrl=%2Feventos%2Fcrear');
  });
});
