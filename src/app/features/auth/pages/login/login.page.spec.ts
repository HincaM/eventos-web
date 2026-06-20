import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let component: LoginPage;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => httpMock.verify());

  const form = (c: LoginPage) => (c as unknown as { form: any }).form;

  it('exige usuario y contrasena', () => {
    expect(form(component)().valid()).toBe(false);
    expect(form(component).username().errors().length).toBeGreaterThan(0);
    expect(form(component).password().errors().length).toBeGreaterThan(0);
  });

  it('hace login y navega al returnUrl cuando las credenciales son validas', async () => {
    const navigateByUrlSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.componentRef.setInput('returnUrl', '/eventos/crear');

    form(component).username().value.set('admin');
    form(component).password().value.set('Admin123!');

    (component as unknown as { onSubmit: (e: SubmitEvent) => void }).onSubmit(new Event('submit') as SubmitEvent);

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.body).toEqual({ username: 'admin', password: 'Admin123!' });
    req.flush({ username: 'admin', token: 'token-123', expiraEn: '2026-01-01T00:00:00Z' });

    await fixture.whenStable();

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/eventos/crear');
  });
});
