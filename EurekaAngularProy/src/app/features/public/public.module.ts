import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LandingPage } from './pages/landing/landing.page';
import { PublicRoutingModule } from './public-routing.module';

@NgModule({
  declarations: [LandingPage],
  imports: [CommonModule, PublicRoutingModule, SharedModule, NgOptimizedImage],
})
export class PublicModule {}
