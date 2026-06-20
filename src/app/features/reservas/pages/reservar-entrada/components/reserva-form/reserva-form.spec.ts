import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservaForm } from './reserva-form';

describe('ReservaForm', () => {
  let component: ReservaForm;
  let fixture: ComponentFixture<ReservaForm>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ReservaForm] });
    fixture = TestBed.createComponent(ReservaForm);
    fixture.componentRef.setInput('eventoId', 'evt-1');
    component = fixture.componentInstance;
  });

  const form = (c: ReservaForm) => (c as unknown as { form: any }).form;

  it('rechaza una cantidad menor a 1', () => {
    form(component).cantidad().value.set(0);

    expect(form(component).cantidad().errors().length).toBeGreaterThan(0);
  });

  it('exige el nombre del comprador', () => {
    expect(form(component).nombreComprador().errors().length).toBeGreaterThan(0);
  });

  it('rechaza un email con formato invalido', () => {
    form(component).emailComprador().value.set('no-es-un-email');

    expect(form(component).emailComprador().errors().length).toBeGreaterThan(0);
  });

  it('es valido con datos correctos y emite la peticion con el eventoId del input', async () => {
    form(component).cantidad().value.set(3);
    form(component).nombreComprador().value.set('Juan Perez');
    form(component).emailComprador().value.set('juan@test.com');

    expect(form(component)().valid()).toBe(true);

    const emitido = new Promise((resolve) => component.reservar.subscribe(resolve));
    (component as unknown as { onSubmit: (e: SubmitEvent) => void }).onSubmit(
      new Event('submit') as SubmitEvent,
    );

    const request = (await emitido) as { eventoId: string; cantidad: number };
    expect(request.eventoId).toBe('evt-1');
    expect(request.cantidad).toBe(3);
  });
});
