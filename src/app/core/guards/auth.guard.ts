import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/**
 * Guard that protects routes that require authentication
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login if not authenticated
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Guard that verifies the user's role
 */
export const roleGuard = (requiredRoles: ('student' | 'teacher' | 'admin')[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getUserRole();

    if (userRole && requiredRoles.includes(userRole)) {
      return true;
    }

    // Redirect to dashboard if the user doesn't have the required role
    router.navigate(['/dashboard']);
    return false;
  };
};
