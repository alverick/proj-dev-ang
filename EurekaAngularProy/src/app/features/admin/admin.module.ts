import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
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
    CommonModule,
    AdminRoutingModule,
    PerfectScrollbarModule,
    SharedModule,
  ],
  providers: [...RESOLVERS],
})
export class AdminModule {}
