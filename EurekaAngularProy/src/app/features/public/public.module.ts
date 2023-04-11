import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { AfiliacionComponent } from './pages/afiliacion/afiliacion.component';
import { LandingCarouselComponent } from './pages/landing/components/landing-carousel/landing-carousel.component';
import { LandingPage } from './pages/landing/landing.page';
import { PublicRoutingModule } from './public-routing.module';

@NgModule({
  declarations: [LandingPage, AfiliacionComponent, LandingCarouselComponent],
  imports: [CommonModule, PublicRoutingModule, SharedModule, NgOptimizedImage],
})
export class PublicModule {}
