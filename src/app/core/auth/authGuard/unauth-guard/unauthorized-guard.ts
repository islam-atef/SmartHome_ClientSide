import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../../authStateService/auth-state.service';

export const unauthorizedGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  // If already authenticated, disallow access immediately
  if (authState.isAuthenticated) {
    router.navigate(['/**']);
    return false;
  }
  return true;
};
