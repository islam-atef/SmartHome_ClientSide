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
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// the subject that will emit the new access token when it is refreshed
const accessTokenSubject = new BehaviorSubject<string | null>(null);
// flag to indicate if a token refresh is in progress
let isRefreshing = false;

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

function checkExpiration(date: Date): boolean {
  const now = new Date();
  const thirtyMinutesMs = 30 * 60 * 1000; // 30 minutes in milliseconds
  return date.getTime() > now.getTime() + thirtyMinutesMs; // 30 minute buffer
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // inject services
  const authState = inject(AuthStateService);
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  // group 1:
  console.group('AuthInterceptor: Intercepting request (Group 1):', req.url);

  // 1) if the request is to login or refresh token, proceed without adding auth header
  if (isAuthRequired(req.url)) {
    // end group 1
    console.groupEnd();
    return next(req);
  }

  // 2) get the access token from the auth state
  const token = authState.getTokensSnapshot();

  if (
    !token ||
    !token.accessToken ||
    !token.refreshToken ||
    !token.expiresAtUtc
  ) {
    console.log(
      'AuthInterceptor: Group 1: No token found, redirecting to login'
    );
    // end group 1
    console.groupEnd();
    // clear any existing tokens in auth state
    authFacade.changeTokens(null);
    accessTokenSubject.next(null);
    // navigate to login page
    router.navigate(['/authentication/login']);
    // return without adding auth header, or even sending the request
    return next(null as any);
  } else {
    // group 2:
    console.group('AuthInterceptor: Token details (Group 2):');
    console.log('AuthInterceptor: Group 2: Token found');

    const accessToken = token.accessToken;
    console.log('AuthInterceptor: Group 2: Current access token:', accessToken);
    const refreshToken = token.refreshToken;
    console.log(
      'AuthInterceptor: Group 2: Current refresh token:',
      refreshToken
    );
    const expiresAtUtc = token.expiresAtUtc;
    console.log(
      'AuthInterceptor: Group 2: Token expiry time (UTC):',
      expiresAtUtc
    );

    // 3) add the auth header to the request
    req = addAuthHeader(req, accessToken);
    console.log('AuthInterceptor: Added Authorization header to request');

    // 4) send the request
    return next(req).pipe(
      map((event: HttpEvent<unknown>) => event),
      tap((event) => {
        console.log(
          'AuthInterceptor: Group 2: Received response for request:',
          req.url,
          event
        );
        // update the token if needed.
        if (checkExpiration(expiresAtUtc) && !isRefreshing) {
          console.log(
            'AuthInterceptor: Group 2: Token is nearing expiration, consider refreshing soon'
          );
          // start refresh in the background
          isRefreshing = true;
          accessTokenSubject.next(null);
          // refresh the token in the background without blocking the current request
          authFacade.refresh().subscribe({
            next: (newTokens) => {
              if (newTokens && newTokens.accessToken) {
                console.log(
                  'AuthInterceptor: Group 2: Token refreshed successfully, using new access token, adding Authorization header to request'
                );
                isRefreshing = false;
                authFacade.changeTokens(newTokens);
                accessTokenSubject.next(newTokens.accessToken);
              }
            },
            error: (refreshError) => {
              isRefreshing = false;
              console.error(
                'AuthInterceptor: Group 2: Failed to refresh token in background',
                refreshError
              );
            },
          });
        }
        // end group 2
        console.groupEnd();
        // end group 1
        console.groupEnd();
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(
          'AuthInterceptor: Group 2: Received error for request:',
          error
        );
        // only handle 401 for non-auth endpoints
        if (error.status !== 401 || isAuthRequired(req.url)) {
          return throwError(() => error);
        } else {
          // if error is 401 Unauthorized, attempt to refresh the token
          console.log(
            'AuthInterceptor: Group 2: 401 Unauthorized error, attempting to refresh token'
          );
          // if a refresh is already in progress, wait for it
          if (isRefreshing) {
            return accessTokenSubject.pipe(
              filter((t) => !!t),
              take(1),
              switchMap((newAccessToken) =>
                next(addAuthHeader(req, newAccessToken!))
              )
            );
          } else {
            // start refresh
            isRefreshing = true;
            accessTokenSubject.next(null);
            return authFacade.refresh().pipe(
              switchMap((newTokens) => {
                if (newTokens && newTokens.accessToken) {
                  console.log(
                    'AuthInterceptor: Group 2: Token refreshed successfully, using new access token, adding Authorization header to request'
                  );
                  // end group 2
                  console.groupEnd();
                  // end group 1
                  console.groupEnd();
                  // reset isRefreshing flag
                  isRefreshing = false;
                  // update auth state with new tokens
                  authFacade.changeTokens(newTokens);
                  accessTokenSubject.next(newTokens.accessToken);
                  // add the auth header to the request with the new access token
                  req = addAuthHeader(req, newTokens.accessToken!);
                  // send the request again
                  return next(req);
                }
                console.error(
                  'AuthInterceptor: Group 2: Token refresh did not return new tokens'
                );
                return throwError(() => new Error('Failed to refresh token'));
              }),
              catchError((refreshError) => {
                console.error(
                  'AuthInterceptor: Group 2: Failed to refresh token',
                  refreshError
                );
                // notify all waiting requests that the refresh has failed
                accessTokenSubject.next(null);
                isRefreshing = false;
                // end group 2
                console.groupEnd();
                // end group 1
                console.groupEnd();
                // clear any existing tokens in auth state
                authFacade.changeTokens(null);
                accessTokenSubject.next(null);
                // navigate to login page
                router.navigate(['/authentication/login']);
                return throwError(() => refreshError);
              })
            );
          }
        }
      })
    );
  }
};
