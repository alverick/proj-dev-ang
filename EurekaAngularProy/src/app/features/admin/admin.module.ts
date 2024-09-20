import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ValdemortModule } from 'ngx-valdemort';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { GtpInputGuard } from '../../shared/guards/gtp-input.guard';
import { AfiliacionService } from '../../shared/services/afiliacion.service';
import { ExcelService } from '../../shared/services/excel.service';
import { GtpService } from '../../shared/services/gtp.service';
import { ProcessService } from '../../shared/services/process.service';
import { SharedModule } from '../../shared/shared.module';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { EmpresaGTPComponent } from './components/empresa-gtp/empresa-gtp.component';
import { ServicesGTPComponent } from './components/services-gtp/services-gtp.component';
import { AprobacionesPage } from './pages/aprobaciones/aprobaciones.page';
import { CargaHistoricoComponent } from './pages/carga-historico/carga-historico.component';
import { ConfigurarCorreoGtpComponent } from './pages/configurar-correo-gtp/configurar-correo-gtp.component';
import { GtpGrillaPage } from './pages/gtp-grilla/gtp-grilla.page';
import { RESOLVERS } from './resolvers';

@NgModule({
  declarations: [
    AdminComponent,
    GtpGrillaPage,
    AprobacionesPage,
    CargaHistoricoComponent,
    EmpresaGTPComponent,
    ServicesGTPComponent,
    ConfigurarCorreoGtpComponent,
    AdminHeaderComponent,
  ],
  imports: [
    HeaderComponent,
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ValdemortModule,
  ],
  providers: [
    ...RESOLVERS,
    ExcelService,
    AfiliacionService,
    AuthGuard,
    GtpInputGuard,
    GtpService,
    ProcessService,
  ],
})
export class AdminModule {}
