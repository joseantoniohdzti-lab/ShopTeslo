import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth/services/auth.service";
import { Observable } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).token();

  // Clone the request to add the authentication header.
  console.log("interceptor")

  const newReq = req.clone({
    headers: req.headers.append( "Authorization", `Bearer ${authToken}`),
  });

  return next(newReq);
}
