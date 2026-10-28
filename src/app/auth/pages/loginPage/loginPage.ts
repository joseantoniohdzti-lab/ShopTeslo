import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';

const login = {
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
};

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './loginPage.html',
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authServices = inject(AuthService);
  private route = inject(Router);
  hasError = signal<boolean>(false);
  isPosting = signal<boolean>(false);

  loginForm = this.fb.group(login);

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);

      setTimeout(() => {
        this.hasError.set(false);
      }, 1000);

      return;
    }

    const { email = '', password = '' } = this.loginForm.value;
    this.authServices.login(email!, password!).subscribe((isAuthenticated) => {
      if(isAuthenticated){
        this.route.navigateByUrl("/");
        return;
      }

      this.hasError.set(true);


      setTimeout(() => {
        this.hasError.set(false);
      }, 1000);

    });
  }
}
