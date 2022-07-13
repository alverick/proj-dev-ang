import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutingNames } from 'src/app/app-routing.collection';
import { LogoutGuard } from '../../shared/guards/logout.guard';
import { AfiliacionComponent } from './pages/afiliacion/afiliacion.component';
import { LandingComponent } from './pages/landing/landing.component';
import { publicRoutingNames } from './public-routing.names';

const routes: Routes = [
  {
    path: appRoutingNames.EMPTY,
    component: LandingComponent,
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
