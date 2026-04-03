import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  Observable,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { AuthStateService } from '../authStateService/auth-state.service';
import { AuthFacadeService } from '../../../features/auth/application/auth-facade.service';
import { inject, signal } from '@angular/core';
import { Router } from '@angular/router';

// the subject that will emit the new access token when it is refreshed
const accessTokenSubject = new BehaviorSubject<string | null>(null);
// flag to indicate if a token refresh is in progress
let isRefreshing = signal<boolean>(false);

/**
 * Adds the Authorization header with the given token to the request.
 * @param req - The request to modify.
 * @param token - The token to add to the Authorization header.
 * @returns A new request with the added Authorization header.
 */
function addAuthHeader(
  req: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Checks if a given URL requires authentication.
 * Returns true if the URL includes '/auth/login' or '/auth/refresh-token', false otherwise.
 * @param url The URL to check.
 * @returns True if the URL requires authentication, false otherwise.
 */
function isAuthRequired(url: string): boolean {
  return (
    url.includes('/Auth/login') ||
    url.includes('/Auth/refresh-token') ||
    url.includes('DevicesAuth/VerifyOTP')
  );
}


function checkAccessTokenExpiration(date: Date | string): boolean {
  /*
  * note that the date is in UTC, and the expiry date for the access token at the server side is (30 minutes)
  * we need to check if the access token is expired or will expire in less than 10 minutes (to be safe)
  */
  const now = new Date();
  const expiryDate = new Date(date);
  const tenMinutesMs = 10 * 60 * 1000; // 10 minutes in milliseconds
  // Refresh if token expires in less than 10 minutes
  return expiryDate.getTime() < now.getTime() + tenMinutesMs;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // inject services
  const authState = inject(AuthStateService);
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  // function to handle 401 errors
  const handle401Error = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    if (!isRefreshing()) {
      isRefreshing.set(true);
      accessTokenSubject.next(null);

      return authFacade.refresh().pipe(
        switchMap((newTokens) => {
          if (newTokens && newTokens.accessToken) {
            console.log('AuthInterceptor: Token refreshed successfully');
            isRefreshing.set(false);
            authFacade.changeTokens(newTokens);
            accessTokenSubject.next(newTokens.accessToken);
            return next(addAuthHeader(request, newTokens.accessToken));
          }
          console.error('AuthInterceptor: Token refresh did not return new tokens');
          return throwError(() => new Error('Failed to refresh token'));
        }),
        catchError((err) => {
          console.error('AuthInterceptor: Failed to refresh token', err);
          isRefreshing.set(false);
          authFacade.changeTokens(null);
          accessTokenSubject.next(null);
          router.navigate(['/authentication/login']);
          return throwError(() => err);
        })
      );
    } else {
      return accessTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next(addAuthHeader(request, token!)))
      );
    }
  };

  // 1) if the request is to login or refresh token, proceed without adding auth header
  if (isAuthRequired(req.url)) {
    return next(req);
  }

  // 2) get the access token from the auth state
  const token = authState.getTokensSnapshot();

  if (!token || !token.accessToken || !token.refreshToken || !token.accessTokenExpiresAtUtc) {
    // No token, but request might need it.
    // However, if we are here, we are not on a public endpoint (checked by isAuthRequired? No, isAuthRequired returns true for Auth endpoints).
    // The previous logic redirected to login if no token found.
    // We should strictly redirect if no token.

    // Note: The original code redirected here. 
    console.log('AuthInterceptor: No token found, redirecting to login');
    authFacade.changeTokens(null);
    accessTokenSubject.next(null);
    router.navigate(['/authentication/login']);
    // return EMPTY or throws to stop request
    return throwError(() => new Error('No authentication token found'));
  }

  const accessToken = token.accessToken;
  const accessTokenExpiresAtUtc = token.accessTokenExpiresAtUtc;

  // 2.1) Check if the access token is expired or will expire in less than 15 minutes
  if (checkAccessTokenExpiration(accessTokenExpiresAtUtc)) {
    // If not refreshing, start refresh
    if (!isRefreshing()) {
      isRefreshing.set(true);
      accessTokenSubject.next(null);

      return authFacade.refresh().pipe(
        switchMap((newTokens) => {
          if (newTokens && newTokens.accessToken) {
            console.log('AuthInterceptor: Pre-emptive Refresh successful');
            isRefreshing.set(false);
            authFacade.changeTokens(newTokens);
            accessTokenSubject.next(newTokens.accessToken);
            return next(addAuthHeader(req, newTokens.accessToken));
          }
          // Failed
          isRefreshing.set(false);
          authFacade.changeTokens(null);
          accessTokenSubject.next(null);
          router.navigate(['/authentication/login']);
          return throwError(() => new Error('Pre-emptive refresh failed'));
        }),
        catchError((err) => {
          isRefreshing.set(false);
          authFacade.changeTokens(null);
          accessTokenSubject.next(null);
          router.navigate(['/authentication/login']);
          return throwError(() => err);
        })
      );
    }
    // If refreshing, wait
    return accessTokenSubject.pipe(
      filter(t => t !== null),
      take(1),
      switchMap(t => next(addAuthHeader(req, t!)))
    );
  }

  // 3) Normal request with existing token
  req = addAuthHeader(req, accessToken);

  // 4) send the request and handle 401
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthRequired(req.url)) {
        console.log('AuthInterceptor: 401 received, attempting refresh');
        return handle401Error(req, next);
      }
      return throwError(() => error);
    })
  );
};
