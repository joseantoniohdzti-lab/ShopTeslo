import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard-layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AdminDashboardLayout {
  authServices = inject(AuthService);

  user = computed(() => this.authServices.user());
}
