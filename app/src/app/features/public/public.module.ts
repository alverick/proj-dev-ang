import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetDirective, PushPipe } from '@ngrx/component';
import { StoreModule } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { LogoutGuard } from '../../shared/guards/logout.guard';
import { CompanyService } from '../../shared/services';
import { appConfigFeature } from '../../store/reducers/app-config.reducer';
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
    StoreModule.forFeature(appConfigFeature),
    PushPipe,
    LetDirective,
    LandingPage,
  ],
  providers: [CompanyService, LogoutGuard],
})
export class PublicModule {}
