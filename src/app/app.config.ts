import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptorInterceptor } from './core/auth/authInterceptors/auth-interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { browserIdInterceptor } from './core/browserIdentifier/browserIdInterceptors/browser-Id-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(
      withInterceptors([authInterceptorInterceptor, browserIdInterceptor])
    ),
    provideRouter(routes),
  ],
};
