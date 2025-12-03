import { type Routes } from '@angular/router';

import { appRoutingNames } from './app-routing.names';
import {
  authFullDynamicRoutingNames,
  authFullRoutingNames,
} from './features/auth/auth-routing.names';

export const routes: Routes = [
  {
    path: appRoutingNames.EMPTY,
    loadChildren: () =>
      import('./features/public/public.routes').then((m) => m.PUBLIC_ROUTES),
  },
  {
    path: appRoutingNames.INTERNAL,
    loadChildren: () =>
      import('./features/internal/internal.routes').then(
        (m) => m.INTERNAL_ROUTES,
      ),
  },
  {
    path: appRoutingNames.ADMIN,
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: appRoutingNames.EMPTY,
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
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

  { path: '**', redirectTo: '/' },
];
