import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@auth/interfaces/user-interfaces';
import { AuthService } from '@auth/services/auth.service';
import { usuario } from '../../services/auth.service';

const register = {
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  name : ["",[Validators.required]]
};


@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RegisterPageComponent {

   private fb = inject(FormBuilder);
  private authServices = inject(AuthService);
  private route = inject(Router);
  hasError = signal<boolean>(false);
  isPosting = signal<boolean>(false);

  RegisterForm = this.fb.group(register);

  onSubmit() {
    if (this.RegisterForm.invalid) {
      this.hasError.set(true);

      setTimeout(() => {
        this.hasError.set(false);
      }, 1000);

      return;
    }

    const { email = '', password = '', name ="" } = this.RegisterForm.value;

    let user = {
      fullName: name ?? "",
      password : password ?? "",
      email: email ?? ""

    }

    console.log(user);

    this.authServices.register(user).subscribe((isAuthenticated) => {
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
