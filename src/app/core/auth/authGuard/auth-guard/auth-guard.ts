import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../../authStateService/auth-state.service';
import { AuthFacadeService } from '../../../../features/auth/application/auth-facade.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthStateService);
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  // If already authenticated, allow access immediately
  if (authState.isAuthenticated) {
    return true;
  }

  if (authState.isRefreshTokenValid) {
    // Try to refresh tokens and wait for the result
    return authFacade.refresh().pipe(
      map(() => {
        // After refresh completes, check authentication status again
        if (authState.isAuthenticated) {
          return true;
        }
        // If still not authenticated, redirect to login
        router.navigate(['/authentication/login']);
        return false;
      })
    );
  }
  // If the refresh token is not valid, redirect to login
  router.navigate(['/authentication/login']);
  return false;
};
