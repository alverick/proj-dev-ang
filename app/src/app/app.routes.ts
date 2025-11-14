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
      import('./features/public/public.routes').then((m) => {
        console.log(m);
        return m.PUBLIC_ROUTES;
      }),
  },
];
