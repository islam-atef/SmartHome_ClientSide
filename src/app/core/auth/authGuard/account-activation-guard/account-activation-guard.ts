import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthFacadeService } from '../../../../features/auth/application/auth-facade.service';
import { map, take } from 'rxjs';

export const accountActivationGuard: CanActivateFn = (route, state) => {
  const authFacade = inject(AuthFacadeService);
  return authFacade.account_activation_PageAccessFlag$.pipe(
    take(1),
    map((flag) => {
      console.log(flag);
      return flag;
    })
  );
};
