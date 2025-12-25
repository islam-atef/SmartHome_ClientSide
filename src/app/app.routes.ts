import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout-component/main-layout-component';
import { authGuard } from './core/auth/authGuard/auth-guard/auth-guard';
import { AuthenticationLayoutComponent } from './layouts/authentication-layout-component/authentication-layout-component';
import { NotFoundPageComponent } from './features/not-found/ui/not-found-page/not-found-page.component';
import { resetPasswordGuard } from './core/auth/authGuard/reset-password-guard/reset-password-guard';
import { accountActivationGuard } from './core/auth/authGuard/account-activation-guard/account-activation-guard';
import { unauthorizedGuard } from './core/auth/authGuard/unauth-guard/unauthorized-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'Main',
        pathMatch: 'full',
      },
      {
        path: 'Main',
        loadComponent: () =>
          import('./features/user-info/ui/main-page/main-component').then(
            (m) => m.MainComponent
          ),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/ui/home-page/home-component').then(
            (m) => m.HomeComponent
          ),
      },
    ],
  },
  {
    path: 'authentication',
    canActivate: [unauthorizedGuard],
    component: AuthenticationLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/ui/login-page/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
      },
      {
        path: 'reset-password',
        canActivate: [resetPasswordGuard],
        loadComponent: () =>
          import(
            './features/auth/ui/reset-password-page/reset-password-component'
          ).then((m) => m.ResetPasswordComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import(
            './features/auth/ui/register-page/register-page-component'
          ).then((m) => m.RegisterPageComponent),
      },
      {
        path: 'account-activation',
        canActivate: [accountActivationGuard],
        loadComponent: () =>
          import(
            './features/auth/ui/account-activation-page/account-activation-page-component'
          ).then((m) => m.AccountActivationPageComponent),
      },
    ],
  },
  {
    path: 'NotFound',
    component: NotFoundPageComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'NotFound',
  },
];
