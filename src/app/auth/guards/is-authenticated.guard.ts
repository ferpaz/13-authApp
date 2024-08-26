import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth-service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  const { url } = state;
  localStorage.setItem('lastUrl', url);

  const authService = inject( AuthService );

  if (authService.authStatus() == AuthStatus.authenticated) return true;

  // Aqui se ejecuta cuando definitivamente no esta autenticado
  const router = inject( Router );
  router.navigateByUrl('/auth/login');

  return false;

};
