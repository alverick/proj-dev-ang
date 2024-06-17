import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { LoadBarComponent } from '../../shared/components/load-bar/load-bar.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { GtpOutputGuard } from '../../shared/guards/gtp-output.guard';
import { AfiliacionService } from '../../shared/services/afiliacion.service';
import { ExcelService } from '../../shared/services/excel.service';
import { HomeService } from '../../shared/services/home.service';
import { LoadBarService } from '../../shared/services/load-bar.service';
import { LoadFileService } from '../../shared/services/load-file.service';
import { TransactionService } from '../../shared/services/transaction.service';
import { SharedModule } from '../../shared/shared.module';
import { EntityStoreModule } from '../../store/entity-store.module';
import { CompanyPasswordFormComponent } from './components/company-password-form/company-password-form.component';
import { CompanyUpdateFormComponent } from './components/company-update-form/company-update-form.component';
import { InternalHeaderComponent } from './components/internal-header/internal-header.component';
import { DateDirective } from './directives/date.directive';
import { PuntoDirective } from './directives/punto.directive';
import { ShearDirective } from './directives/shear.directive';
import { InternalComponent } from './internal.component';
import { InternalRoutingModule } from './internal-routing.module';
import { PAGES } from './pages';
import { AgregaCobroComponent } from './pages/home/components/agrega-cobro.component';
import { CommissionsInfoComponent } from './pages/home/components/comissions-info/commissions-info.component';
import { DebtComponent } from './pages/home/components/debt.component';
import { DialogComponent } from './pages/home/components/dialog';
import { PaymentDetailComponent } from './pages/home/components/payment-detail/payment-detail.component';
import { TableMovementsComponent } from './pages/home/components/table-movements/table-movements.component';
import { RESOLVERS } from './resolvers';
import { SERVICES } from './services';

@NgModule({
  declarations: [
    InternalComponent,
    AgregaCobroComponent,
    DateDirective,
    DebtComponent,
    DialogComponent,
    LoadBarComponent,
    PuntoDirective,
    ShearDirective,
    InternalHeaderComponent,
    PaymentDetailComponent,
    CompanyUpdateFormComponent,
    CompanyPasswordFormComponent,
    ...PAGES,
    TableMovementsComponent,
    CommissionsInfoComponent,
  ],
  imports: [
    CommonModule,
    InternalRoutingModule,
    PerfectScrollbarModule,
    HeaderComponent,
    EntityStoreModule,
    SharedModule,
  ],
  providers: [
    ...SERVICES,
    ...RESOLVERS,
    AfiliacionService,
    ExcelService,
    LoadFileService,
    AuthGuard,
    HomeService,
    GtpOutputGuard,
    TransactionService,
    LoadBarService,
  ],
})
export class InternalModule {}
