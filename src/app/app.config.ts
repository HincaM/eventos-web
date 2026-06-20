import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { apiUrlInterceptor } from './core/interceptors/api-url.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiUrlInterceptor, loadingInterceptor, apiErrorInterceptor]),
    ),
  ],
};
