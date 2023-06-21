import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutingNames } from 'src/app/app-routing.collection';

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
