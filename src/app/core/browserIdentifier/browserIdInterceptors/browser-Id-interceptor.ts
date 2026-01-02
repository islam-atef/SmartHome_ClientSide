import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFacadeService } from '../../../features/auth/application/auth-facade.service';
import { BrowserIdStateService } from '../browserIdStateService/browser-id-state.service';
import { catchError, EMPTY, switchMap, tap, throwError, of } from 'rxjs';
import { BrowserIdentifierModel } from '../browser-Identifier-Model';
import { E } from '@angular/cdk/keycodes';

const DAY_MS = 24 * 60 * 60 * 1000;

// add MAC header Helper:
function addMACHeader(
  req: HttpRequest<unknown>,
  browserId: string | null | undefined
): HttpRequest<unknown> {
  if (!browserId) {
    console.warn(
      'Browser ID is missing, request sent without Device-Mac header'
    );
    return req;
  }
  if (!req) {
    throw new Error('HTTP Request object is null');
  }
  return req.clone({
    setHeaders: { 'Device-Mac': browserId },
  });
}
// interceptor function:

function handleBrowserIdUpdate(
  currentIdentifier: BrowserIdentifierModel | null,
  browserIdState: BrowserIdStateService,
  authFacade: AuthFacadeService
) {
  if (currentIdentifier) {
    authFacade.UpdateBrowserId().subscribe((res) => {
      if (res) {
        currentIdentifier = browserIdState.getIdentifierSnapshot();
        let Identifier = currentIdentifier!;
        Identifier.isUpdated = true;
        Identifier.updatedAt = new Date();
        browserIdState.setIdentifier(Identifier);
      } else {
        console.error('Failed to update browser identifier');
        return;
      }
      (err: HttpErrorResponse) => {
        console.error('Error updating browser identifier:', err);
        return EMPTY;
      };
    });
  }
}

export const browserIdInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacadeService);
  const browserIdState = inject(BrowserIdStateService);

  if (req == null) {
    throw new Error(
      'browserIdInterceptor received null request - check service initialization'
    );
  }

  let currentIdentifier = browserIdState.getIdentifierSnapshot();
  const hasBrowserId = !!currentIdentifier?.browserId;

  if (hasBrowserId) {
    const MACReq = addMACHeader(req, currentIdentifier!.browserId!);
    return next(MACReq);
  } else {
    return authFacade.UpdateBrowserId().pipe(
      switchMap((res) => {
        if (res) {
          currentIdentifier = browserIdState.getIdentifierSnapshot();
          if (currentIdentifier?.browserId) {
            const MACReq = addMACHeader(req, currentIdentifier.browserId);
            return next(MACReq);
          } else {
            console.warn('Browser ID still unavailable after update');
            return next(req);
          }
        } else {
          console.error('Failed to update browser identifier');
          return next(req);
        }
      }),
      catchError((err) => {
        console.error('Error updating browser identifier:', err);
        return next(req);
      })
    );
  }
};
