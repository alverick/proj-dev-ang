import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetDirective, PushPipe } from '@ngrx/component';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { LogoutGuard } from '../../shared/guards/logout.guard';
import { LandingPage } from './pages/landing/landing.page';
import { PublicRoutingModule } from './public-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    PublicRoutingModule,
    NgOptimizedImage,
    CarouselModule,
    RippleModule,
    ToastModule,
    HeaderComponent,
    PushPipe,
    LetDirective,
    LandingPage,
  ],
  providers: [LogoutGuard],
})
export class PublicModule {}
