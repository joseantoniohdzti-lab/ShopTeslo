import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { usuario } from '../services/auth.service';
import { firstValueFrom, tap } from 'rxjs';

export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {

  const authServices = inject(AuthService);
  const router = inject(Router);

  await firstValueFrom(authServices.checkStatus());

  return  authServices.isAdmin();
};
