import { NgModule } from '@angular/core';
import { type Routes, RouterModule } from '@angular/router';

import { appRoutingNames } from '../../app-routing.names';
import { LogoutGuard } from '../../shared/guards/logout.guard';
import { LandingPage } from './pages/landing/landing.page';

const routes: Routes = [
  {
    path: appRoutingNames.EMPTY,
    component: LandingPage,
    canActivate: [LogoutGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
