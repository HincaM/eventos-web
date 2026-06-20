import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../services/notification.service';
import { extractApiErrorMessage } from '../helpers/api-error.helper';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 && authService.isAuthenticated()) {
          authService.logout();
          router.navigateByUrl('/login');
        }
        notificationService.show(extractApiErrorMessage(error), 'danger');
      }
      return throwError(() => error);
    }),
  );
};
