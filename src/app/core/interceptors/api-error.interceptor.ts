import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { extractApiErrorMessage } from '../helpers/api-error.helper';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        notificationService.show(extractApiErrorMessage(error), 'danger');
      }
      return throwError(() => error);
    }),
  );
};
