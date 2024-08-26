import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth-service';
import { AuthStatus } from '../interfaces';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  if (authService.authStatus() !== AuthStatus.authenticated) {
    // Aqui se ejecuta cuando definitivamente no esta autenticado
    localStorage.removeItem('lastUrl');

    return true;
  }

  const router = inject(Router);
  router.navigateByUrl('/dashboard');

  return false;

};
