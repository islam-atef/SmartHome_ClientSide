import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFacadeService } from '../../../features/auth/application/auth-facade.service';
import { BrowserIdStateService } from '../browserIdStateService/browser-id-state.service';
import { catchError, EMPTY, tap, throwError } from 'rxjs';
import { BrowserIdentifierModel } from '../browser-Identifier-Model';
import { E } from '@angular/cdk/keycodes';

const DAY_MS = 24 * 60 * 60 * 1000;

// add MAC header Helper:
function addMACHeader(
  req: HttpRequest<unknown>,
  browserId: string
): HttpRequest<unknown> {
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

  let currentIdentifier = browserIdState.getIdentifierSnapshot();
  const hasBrowserId = !!currentIdentifier?.browserId;
  let MACReq = req;

  if (hasBrowserId) {
    MACReq = addMACHeader(req, currentIdentifier!.browserId!);
  } else {
    authFacade.UpdateBrowserId().subscribe((res) => {
      if (res) {
        currentIdentifier = browserIdState.getIdentifierSnapshot();
        MACReq = addMACHeader(req, currentIdentifier!.browserId!);
      }
    });
  }
  return next(MACReq);

  // return next(MACReq).pipe(
  //   catchError((err: HttpErrorResponse) => {
  //     console.error('Error in HTTP request:', err);
  //     return EMPTY;
  //   }),
  //   tap(() => {
  //     // Check if the browser id needs to be updated
  //     const expiresMs = currentIdentifier?.createdAt.getTime() ?? 0; // Date → number
  //     const nowMs = Date.now();
  //     const elapsedTime = nowMs - expiresMs;
  //     if (elapsedTime > DAY_MS) {
  //       handleBrowserIdUpdate(currentIdentifier, browserIdState, authFacade);
  //     }
  //   })
  // );
};
