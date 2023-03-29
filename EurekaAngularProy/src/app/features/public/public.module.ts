import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { AfiliacionComponent } from './pages/afiliacion/afiliacion.component';
import { LandingComponent } from './pages/landing/landing.component';
import { PublicRoutingModule } from './public-routing.module';

@NgModule({
  declarations: [LandingComponent, AfiliacionComponent],
  imports: [CommonModule, PublicRoutingModule, SharedModule, NgOptimizedImage],
})
export class PublicModule {}
