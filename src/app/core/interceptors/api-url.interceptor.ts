import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { environment } from '../../../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (!/^https?:\/\//i.test(req.url)) {
    const platformId = inject(PLATFORM_ID);
    const baseUrl = isPlatformServer(platformId) ? environment.internalApiUrl : environment.apiUrl;
    req = req.clone({ url: `${baseUrl}${req.url}` });
  }
  return next(req);
};
