import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSelector } from './selector';

interface Item {
  id: string;
  nombre: string;
}

describe('UiSelector', () => {
  let fixture: ComponentFixture<UiSelector<Item>>;
  let component: UiSelector<Item>;

  const items: Item[] = [
    { id: '1', nombre: 'Uno' },
    { id: '2', nombre: 'Dos' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [UiSelector] });
    fixture = TestBed.createComponent(UiSelector<Item>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('labelFn', (item: Item) => item.nombre);
    fixture.componentRef.setInput('valueFn', (item: Item) => item.id);
    fixture.detectChanges();
  });

  it('muestra el mensaje de vacio cuando no hay items', () => {
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('vacioMensaje', 'Nada por aqui.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nada por aqui.');
    expect(fixture.nativeElement.querySelector('select')).toBeNull();
  });

  it('renderiza una opcion por cada item usando labelFn y valueFn', () => {
    const options = fixture.nativeElement.querySelectorAll('option');

    expect(options.length).toBe(3);
    expect(options[1].value).toBe('1');
    expect(options[1].textContent.trim()).toBe('Uno');
    expect(options[2].value).toBe('2');
    expect(options[2].textContent.trim()).toBe('Dos');
  });

  it('emite el valor seleccionado', () => {
    const seleccionado = vi.fn();
    component.seleccionado.subscribe(seleccionado);

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = '2';
    select.dispatchEvent(new Event('change'));

    expect(seleccionado).toHaveBeenCalledWith('2');
  });

  it('no emite nada al volver a la opcion vacia', () => {
    const seleccionado = vi.fn();
    component.seleccionado.subscribe(seleccionado);

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = '';
    select.dispatchEvent(new Event('change'));

    expect(seleccionado).not.toHaveBeenCalled();
  });
});
