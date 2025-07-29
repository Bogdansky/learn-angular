import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (authService.getIsAuthenticated()) {
    return true;
  }

  const router = inject(Router);

  return router.navigate(
    ['/login'], 
    { 
      queryParams: { returnUrl: state.url } 
    });
};
