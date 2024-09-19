import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetDirective, PushPipe } from '@ngrx/component';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { RecaptchaModule } from 'ng-recaptcha';
import { CookieService } from 'ngx-cookie-service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ValdemortModule } from 'ngx-valdemort';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { LogoutGuard } from '../../shared/guards/logout.guard';
import { NotifyService } from '../../shared/services/notify.service';
import { RecuperaService } from '../../shared/services/recupera.service';
import { StorageService } from '../../shared/services/storage.service';
import { SharedModule } from '../../shared/shared.module';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { CompanyFormAuthComponent } from './components/company-form-auth/company-form-auth.component';
import { CompanyFormRegistrationComponent } from './components/company-form-registration/company-form-registration.component';
import { LayoutFormComponent } from './components/layout-form/layout-form.component';
import { SidebarCompanyComponent } from './components/sidebar-company/sidebar-company.component';
import { GUARDS } from './guards';
import { PAGES } from './pages';
import { SERVICES } from './services';

@NgModule({
  imports: [
    CommonModule,
    HeaderComponent,
    AuthRoutingModule,
    RecaptchaModule,
    DigitOnlyModule,
    SharedModule,
    PerfectScrollbarModule,
    NgOptimizedImage,
    PushPipe,
    LetDirective,
    ValdemortModule,
  ],
  providers: [
    ...GUARDS,
    ...SERVICES,
    CookieService,
    NotifyService,
    LogoutGuard,
    AuthGuard,
    RecuperaService,
  ],
  declarations: [
    AuthComponent,
    CompanyFormRegistrationComponent,
    CompanyFormAuthComponent,
    SidebarCompanyComponent,
    ...PAGES,
    LayoutFormComponent,
  ],
  exports: [],
})
export class AuthModule {}
