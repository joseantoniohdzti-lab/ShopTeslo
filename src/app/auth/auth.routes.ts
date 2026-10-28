import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-Layout/auth-Layout';
import { Component } from '@angular/core';
import { LoginPageComponent } from './pages/loginPage/loginPage';
import { RegisterPageComponent } from './pages/register-page/register-page';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'register',
        component: RegisterPageComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

export default authRoutes;
