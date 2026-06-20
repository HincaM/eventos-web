import { HttpErrorResponse } from '@angular/common/http';
import { extractApiErrorMessage } from './api-error.helper';

describe('extractApiErrorMessage', () => {
  it('concatena los mensajes de un ValidationProblemDetails con errores por campo', () => {
    const error = new HttpErrorResponse({
      error: { errors: { Titulo: ['El titulo es obligatorio.'], Precio: ['El precio debe ser mayor a 0.'] } },
    });

    const mensaje = extractApiErrorMessage(error);

    expect(mensaje).toContain('El titulo es obligatorio.');
    expect(mensaje).toContain('El precio debe ser mayor a 0.');
  });

  it('usa el detail cuando no hay errores de validacion', () => {
    const error = new HttpErrorResponse({ error: { detail: 'El venue no existe.' } });

    expect(extractApiErrorMessage(error)).toBe('El venue no existe.');
  });

  it('usa el title cuando no hay detail ni errores', () => {
    const error = new HttpErrorResponse({ error: { title: 'Conflicto' } });

    expect(extractApiErrorMessage(error)).toBe('Conflicto');
  });

  it('devuelve un mensaje generico cuando el cuerpo no tiene informacion util', () => {
    const error = new HttpErrorResponse({ error: 'texto plano sin estructura' });

    expect(extractApiErrorMessage(error)).toBe('Ocurrió un error inesperado al comunicarse con el servidor.');
  });
});
