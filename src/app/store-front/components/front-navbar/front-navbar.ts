import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class FrontNavbar {

  authServices = inject(AuthService);
}
