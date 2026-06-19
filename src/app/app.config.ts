import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, withXsrfConfiguration } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { TokenInterceptor } from './aunth/token.interceptor';
import { AlwaysAuthGuard } from './aunth/AlwaysAuthGuard';
import { MockInterceptor } from './mocks/mock.interceptor';

import { registerLocaleData } from '@angular/common';
import localeMx from '@angular/common/locales/es-MX';
import localeMxExtra from '@angular/common/locales/extra/es-MX';

registerLocaleData(localeMx, 'es-MX', localeMxExtra);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withHashLocation()),
    provideHttpClient(
      withInterceptorsFromDi(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideAnimations(),
    AlwaysAuthGuard
  ]
};
