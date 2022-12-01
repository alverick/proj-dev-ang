import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyPasswordFormComponent } from './components/company-password-form/company-password-form.component';
import { CompanyUpdateFormComponent } from './components/company-update-form/company-update-form.component';
import { HelpItemComponent } from './components/help-item/help-item.component';
import { InternalAuthComponent } from './components/internal-auth/internal-auth.component';
import { InternalHeaderComponent } from './components/internal-header/internal-header.component';
import { DateDirective } from './directives/date.directive';
import { DecimalesDirective } from './directives/decimales.directive';
import { NumberDirectiveHome } from './directives/number.directive';
import { PuntoDirective } from './directives/punto.directive';
import { ShearDirective } from './directives/shear.directive';
import { InternalRoutingModule } from './internal-routing.module';
import { InternalComponent } from './internal.component';
import { CompanyConfigurationPage } from './pages/company-configuration/company-configuration.page';
import { ConfiguraCobrosParteCuatroComponent } from './pages/configura-cobros-parte-cuatro/configura-cobros-parte-cuatro.component';
import { ConfiguraCobrosParteDosComponent } from './pages/configura-cobros-parte-dos/configura-cobros-parte-dos.component';
import { ConfiguraCobrosParteTresComponent } from './pages/configura-cobros-parte-tres/configura-cobros-parte-tres.component';
import { ConfiguraCobrosParteUnoComponent } from './pages/configura-cobros-parte-uno/configura-cobros-parte-uno.component';
import { ConfigurarEmpresaComponent } from './pages/configurar-empresa/configurar-empresa.component';
import { EditarCobrosComponent } from './pages/editar-cobros/editar-cobros.component';
import { HelpPage } from './pages/help/help.page';
import { AgregaCobroComponent } from './pages/home/components/agrega-cobro.component';
import { DebtComponent } from './pages/home/components/debt.component';
import { PaymentDetailComponent } from './pages/home/components/payment-detail/payment-detail.component';
import { HomePage } from './pages/home/home.page';
import { ResumenCobrosComponent } from './pages/resumen-cobros/resumen-cobros.component';
import { SERVICES } from './services';

@NgModule({
  declarations: [
    InternalComponent,
    HomePage,
    HelpPage,
    ConfigurarEmpresaComponent,
    ResumenCobrosComponent,
    AgregaCobroComponent,
    EditarCobrosComponent,
    ConfiguraCobrosParteUnoComponent,
    ConfiguraCobrosParteDosComponent,
    ConfiguraCobrosParteTresComponent,
    ConfiguraCobrosParteCuatroComponent,
    DateDirective,
    DebtComponent,
    DecimalesDirective,
    NumberDirectiveHome,
    PuntoDirective,
    ShearDirective,
    InternalHeaderComponent,
    InternalAuthComponent,
    PaymentDetailComponent,
    HelpItemComponent,
    CompanyUpdateFormComponent,
    CompanyPasswordFormComponent,
    CompanyConfigurationPage,
  ],
  imports: [
    CommonModule,
    InternalRoutingModule,
    PerfectScrollbarModule,
    SharedModule,
  ],
  entryComponents: [
    AgregaCobroComponent,
    DebtComponent,
    PaymentDetailComponent,
  ],
  providers: [...SERVICES],
})
export class InternalModule {}
