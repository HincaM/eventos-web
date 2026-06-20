import { HttpErrorResponse } from '@angular/common/http';

interface ValidationProblemDetails {
  errors?: Record<string, string[]>;
  detail?: string;
  title?: string;
}

export function extractApiErrorMessage(error: HttpErrorResponse): string {
  const body = error.error as ValidationProblemDetails | string | null;

  if (body && typeof body === 'object') {
    if (body.errors) {
      return Object.values(body.errors).flat().join(' ');
    }
    if (body.detail) {
      return body.detail;
    }
    if (body.title) {
      return body.title;
    }
  }

  return 'Ocurrió un error inesperado al comunicarse con el servidor.';
}
