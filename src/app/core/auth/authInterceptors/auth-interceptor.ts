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
  Observable,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { AuthStateService } from '../authStateService/auth-state.service';
import { AuthFacadeService } from '../../../features/auth/application/auth-facade.service';
import { inject } from '@angular/core';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

// add auth header Helper:
function addAuthHeader(
  req: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

// check if auth is required (not required for login and refresh token):
function isAuthRequired(url: string): boolean {
  return url.includes('/auth/login') || url.includes('/auth/refresh-token');
}

// handle 401 errors Helper:
function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authState: AuthStateService,
  authFacade: AuthFacadeService
): Observable<HttpEvent<unknown>> {
  const currentTokens = authState.getTokensSnapshot();
  const hasRefreshToken = !!currentTokens?.refreshToken;

  // if there is no refresh token, throw an error
  if (!hasRefreshToken) {
    return throwError(() => new Error('No refresh token available'));
  }

  // when entering for the first time, set isRefreshing to true
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);
    // refresh the access token
    return authFacade.refresh().pipe(
      switchMap((tokens) => {
        isRefreshing = false;
        // if there is no access token, throw an error
        if (!tokens || !tokens.accessToken) {
          authFacade.logout();
          return throwError(() => new Error('Refresh token failed'));
        }
        // else, apply the access token to the request
        refreshTokenSubject.next(tokens.accessToken);
        // add the auth header to the request
        const newReq = addAuthHeader(req, tokens.accessToken);
        return next(newReq);
      }),
      catchError((err) => {
        isRefreshing = false;
        authFacade.logout();
        return throwError(() => err);
      })
    );
  }
  // else, an already refreshing has occurred
  else {
    // when refreshing, add the refresh token to the request
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        const newReq = addAuthHeader(req, token!);
        return next(newReq);
      })
    );
  }
}
export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthStateService);
  const authFacade = inject(AuthFacadeService);

  // if the request is not auth required, pass it through
  if (isAuthRequired(req.url)) {
    return next(req);
  }

  // if the request is auth required, check if the access token is available
  const currentTokens = authState.getTokensSnapshot();
  const hasAccessToken = !!currentTokens?.accessToken;
  let authReq = req;

  // if the access token is available, add it to the request
  if (hasAccessToken) {
    authReq = addAuthHeader(req, currentTokens!.accessToken!);
  }

  return next(authReq).pipe(
    // if there is no error
    tap(() => {
      const expiresMs = currentTokens?.expiresAtUtc.getTime() ?? 0; // Date → number
      const nowMs = Date.now();
      if (expiresMs < nowMs) {
        authFacade.refresh();
        return;
      }
      const remainingTime = expiresMs - nowMs;
      const remainingHours = remainingTime / 1000 / 60 / 60;
      if (remainingHours < 1) {
        authFacade.refresh();
        return;
      }
      return;
    }),
    // if there is an error
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        // if the error is 401, handle it
        return handle401Error(authReq, next, authState, authFacade);
      }
      return throwError(() => err);
    })
  );
};
