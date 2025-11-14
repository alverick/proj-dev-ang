import { type Routes } from '@angular/router';

import { appRoutingNames } from '../../app-routing.names';
import { LogoutGuard } from '../../shared/guards/logout.guard';
import { LandingPage } from './pages/landing/landing.page';

console.log('public',LandingPage);

export const PUBLIC_ROUTES: Routes = [
  {
    path: appRoutingNames.EMPTY,
    component: LandingPage,
    canActivate: [LogoutGuard],
  },
];
