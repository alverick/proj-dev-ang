import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutingNames } from './app-routing.names';
import {
  authFullDynamicRoutingNames,
  authFullRoutingNames,
} from './features/auth/auth-routing.names';

const routes: Routes = [
  {
    path: appRoutingNames.EMPTY,
    loadChildren: () =>
      import('./features/internal/internal.module').then(
        (m) => m.InternalModule
      ),
  },
  {
    path: appRoutingNames.LANDING,
    loadChildren: () =>
      import('./features/public/public.module').then((m) => m.PublicModule),
  },
  {
    path: appRoutingNames.ADMIN,
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: appRoutingNames.AUTH,
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'cambiaContra/:llave',
    redirectTo: authFullDynamicRoutingNames.CHANGE_PASSWORD,
  },
  {
    path: 'editarSvcGTP',
    redirectTo: authFullRoutingNames.SERVICES_EDIT_GTP,
  },
  {
    path: 'configurarServicios',
    redirectTo: authFullRoutingNames.SERVICES_CONFIGURE,
  },
  {
    path: 'editarServicios',
    redirectTo: authFullRoutingNames.SERVICES_EDIT,
  },
  {
    path: 'crearContrasena',
    redirectTo: authFullRoutingNames.GENERATE_PASSWORD,
  },
  {
    path: 'editaCuenta/:token',
    redirectTo: authFullDynamicRoutingNames.REGISTER_UPDATING_VALIDATION,
  },
  {
    path: 'configuracion',
    redirectTo: authFullRoutingNames.CONFIGURATION,
  },
  {
    path: 'ApGTP/:llave',
    redirectTo: authFullDynamicRoutingNames.COMPANY_CONFIGURATION,
  },
  { path: 'ApGTP', redirectTo: authFullRoutingNames.COMPANY_CONFIGURATION },

  { path: '**', redirectTo: 'landing' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
