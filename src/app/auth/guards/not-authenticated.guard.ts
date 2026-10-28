import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Navigation } from 'swiper/modules';

export const NotAuthenticatedGuard: CanMatchFn = async(
  route: Route,
  segments: UrlSegment[]
) => {

  const authServices = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authServices.checkStatus());

  console.log("guard",isAuthenticated);

  if(isAuthenticated){
    router.navigateByUrl("/");
    return false;
  }

  return true;
};
