import { DialogComponent } from './home/dialog';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ConfigurarEmpresaComponent } from './configurar-empresa/configurar-empresa.component';
import { SubirPlantillaComponent } from './subir-plantilla/subir-plantilla.component';
import { AnalisisComponent } from './analisis/analisis.component';
import { GtpGrillaComponent } from './gtp-grilla/gtp-grilla.component';
import { AprobacionesComponent } from './aprobaciones/aprobaciones.component';

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
    AprobacionesComponent]
})
export class PagesModule {
  constructor (@Optional() @SkipSelf() parentModule: PagesModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
