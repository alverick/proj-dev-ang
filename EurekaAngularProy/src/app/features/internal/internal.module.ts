import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyPasswordFormComponent } from './components/company-password-form/company-password-form.component';
import { CompanyUpdateFormComponent } from './components/company-update-form/company-update-form.component';
import { HelpItemComponent } from './components/help-item/help-item.component';
import { InternalHeaderComponent } from './components/internal-header/internal-header.component';
import { DateDirective } from './directives/date.directive';
import { DecimalesDirective } from './directives/decimales.directive';
import { NumberDirectiveHome } from './directives/number.directive';
import { PuntoDirective } from './directives/punto.directive';
import { ShearDirective } from './directives/shear.directive';
import { InternalRoutingModule } from './internal-routing.module';
import { InternalComponent } from './internal.component';
import { PAGES } from './pages';
import { AgregaCobroComponent } from './pages/home/components/agrega-cobro.component';
import { DebtComponent } from './pages/home/components/debt.component';
import { PaymentDetailComponent } from './pages/home/components/payment-detail/payment-detail.component';
import { RESOLVERS } from './resolvers';
import { SERVICES } from './services';

@NgModule({
  declarations: [
    InternalComponent,
    AgregaCobroComponent,
    DateDirective,
    DebtComponent,
    DecimalesDirective,
    NumberDirectiveHome,
    PuntoDirective,
    ShearDirective,
    InternalHeaderComponent,
    PaymentDetailComponent,
    HelpItemComponent,
    CompanyUpdateFormComponent,
    CompanyPasswordFormComponent,
    ...PAGES,
  ],
  imports: [
    CommonModule,
    InternalRoutingModule,
    PerfectScrollbarModule,
    SharedModule,
  ],
  providers: [...SERVICES, ...RESOLVERS],
})
export class InternalModule {}
