import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutingNames } from 'src/app/app-routing.collection';
import { LogoutGuard } from '../../shared/guards/logout.guard';
import { AfiliacionComponent } from './pages/afiliacion/afiliacion.component';
import { LandingPage } from './pages/landing/landing.page';
import { publicRoutingNames } from './public-routing.names';

const routes: Routes = [
  {
    path: appRoutingNames.EMPTY,
    component: LandingPage,
    canActivate: [LogoutGuard],
  },
  {
    path: publicRoutingNames.AFFILIATION,
    component: AfiliacionComponent,
    canActivate: [LogoutGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
