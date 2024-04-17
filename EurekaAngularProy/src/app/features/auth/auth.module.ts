import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { RecaptchaModule } from 'ng-recaptcha';
import { CookieService } from 'ngx-cookie-service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from '../../shared/guards/auth.guard';
import { CloseViewGuard } from '../../shared/guards/close-view.guard';
import { LogoutGuard } from '../../shared/guards/logout.guard';
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
    AuthRoutingModule,
    RecaptchaModule,
    DigitOnlyModule,
    SharedModule,
    PerfectScrollbarModule,
    NgOptimizedImage,
  ],
  providers: [
    ...GUARDS,
    ...SERVICES,
    StorageService,
    AuthGuard,
    CookieService,
    LogoutGuard,
    CloseViewGuard,
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
