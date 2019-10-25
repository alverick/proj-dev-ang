import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module'; 
import { GtpGrillaComponent } from './gtp-grilla/gtp-grilla.component';
import { AprobacionesComponent } from './aprobaciones/aprobaciones.component';
import { EmpresaGTPComponent } from './empresa-gtp/empresa-gtp.component';
import { ServicesGTPComponent } from './services-gtp/services-gtp.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,

  ],
  declarations: [
    //HomeComponent,
    //ConfigurarEmpresaComponent,
    //SubirPlantillaComponent,
    //AnalisisComponent
    GtpGrillaComponent,
    AprobacionesComponent,
    EmpresaGTPComponent,
    ServicesGTPComponent ]
})
export class PagesModule {
  constructor (@Optional() @SkipSelf() parentModule: PagesModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
