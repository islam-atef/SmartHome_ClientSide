import { CanActivateFn } from '@angular/router';
import { AuthFacadeService } from '../../../../features/auth/application/auth-facade.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const resetPasswordGuard: CanActivateFn = (route, state) => {
  const authfacade = inject(AuthFacadeService);
  return authfacade.reset_password_PageAccessFlag$.pipe(
    take(1),
    map((flag) => {
      return flag;
    })
  );
};
