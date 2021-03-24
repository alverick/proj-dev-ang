import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AfiliacionComponent } from 'src/app/auth/afiliacion/afiliacion.component';
import { AnalisisComponent } from 'src/app/pages/analisis/analisis.component';
import { AprobacionesComponent } from './pages/aprobaciones/aprobaciones.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { CambiaContrasenaComponent } from './auth/cambia-contrasena/cambia-contrasena.component';
import { CargaHistoricoComponent } from './auth/carga-historico/carga-historico.component';
import { ClientGuard } from './shared/guards/client.guard';
import { CommonModule } from '@angular/common';
import { CompletadoPrimeraParteComponent } from './auth/completado-primera-parte/completado-primera-parte.component';
import { CompletarDatosEmpresaComponent } from './auth/completar-datos-empresa/completar-datos-empresa.component';
import { ConfiguraCobrosParteCuatroComponent } from './auth/configura-cobros-parte-cuatro/configura-cobros-parte-cuatro.component';
import { ConfiguraCobrosParteDosComponent } from './auth/configura-cobros-parte-dos/configura-cobros-parte-dos.component';
import { ConfiguraCobrosParteTresComponent } from './auth/configura-cobros-parte-tres/configura-cobros-parte-tres.component';
import { ConfiguraCobrosParteUnoComponent } from './auth/configura-cobros-parte-uno/configura-cobros-parte-uno.component';
import { ConfigurarCorreoGtpComponent } from './auth/configurar-correo-gtp/configurar-correo-gtp.component';
import { ConfigurarEmpresaComponent } from './pages/configurar-empresa/configurar-empresa.component';
import { ConfigurarGtpComponent } from './auth/configurar-gtp/configurar-gtp.component';
import { ConfigurarServiciosComponent } from 'src/app/auth/configurar-servicios/configurar-servicios.component';
import { CrearContrasenaComponent } from 'src/app/auth/crear-contrasena/crear-contrasena.component';
import { EditarCobrosComponent } from './auth/editar-cobros/editar-cobros.component';
import { GtpGrillaComponent } from './pages/gtp-grilla/gtp-grilla.component';
import { GtpInputGuard } from './shared/guards/gtp-input.guard';
import { GtpOutputGuard } from './shared/guards/gtp-output.guard';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { IdentificarEmpresaComponent } from 'src/app/auth/identificar-empresa/identificar-empresa.component';
import { LandingComponent } from './auth/landing/landing.component';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { LogoutGuard } from './shared/guards/logout.guard';
import { PageNotFoundComponent } from 'src/app/pages/page-not-found/page-not-found.component';
import { ProcesandoComponent } from 'src/app/auth/procesando/procesando.component';
import { RecuperarContrasenaComponent } from './auth/recuperar-contrasena/recuperar-contrasena.component';
import { ResumenCobrosComponent } from './auth/resumen-cobros/resumen-cobros.component';
import { SubirPlantillaComponent } from 'src/app/pages/subir-plantilla/subir-plantilla.component';

// CambiaContrasenaComponent

const routes: Routes = [
  { path: 'home', component: HomeComponent ,   canActivate: [AuthGuard , GtpOutputGuard] },
  { path: 'landing', component: LandingComponent , canActivate: [LogoutGuard]},
  { path: 'login', component: LoginComponent , canActivate: [LogoutGuard]},
  { path: 'cambiaContra/:llave', component: CambiaContrasenaComponent , canActivate: [LogoutGuard]},
  { path: 'recupera', component: RecuperarContrasenaComponent , canActivate: [LogoutGuard]},
  { path: 'afiliacion', component: AfiliacionComponent, canActivate: [LogoutGuard]},
  { path: 'editarSvcGTP', component: ConfigurarServiciosComponent, data: {  isgtp: true }},
  { path: 'configurarCorreoGTP', component: ConfigurarCorreoGtpComponent, canActivate: [AuthGuard, GtpInputGuard]},
  { path: 'configurarServicios', component: ConfigurarServiciosComponent, data: { isEdit: false }, canActivate: [ClientGuard] },
  { path: 'editarServicios', component: ConfigurarServiciosComponent, data: { isEdit: true }, canActivate: [ AuthGuard, GtpOutputGuard ] },
  { path: 'crearContrasena', component: CrearContrasenaComponent, data: { isEdit: false }},

  { path: 'identifiquemosEmpresa', component: IdentificarEmpresaComponent, data: { isEdit: false }},
  { path: 'completaDatosEmpresa', component: CompletarDatosEmpresaComponent, data: { isEdit: false }},
  { path: 'completadoPrimeraParte', component: CompletadoPrimeraParteComponent, data: { isEdit: false }},
  { path: 'configuraCobrosParteUnoAfiliacion', component: ConfiguraCobrosParteUnoComponent, data: { isEdit: false }},
  { path: 'configuraCobrosParteUno', component: ConfiguraCobrosParteUnoComponent, data: { isEdit: true }},
  { path: 'configuraCobrosParteDos', component: ConfiguraCobrosParteDosComponent, data: { isEdit: false }},
  { path: 'configuraCobrosParteTres', component: ConfiguraCobrosParteTresComponent, data: { isEdit: false }},
  { path: 'configuraCobrosParteCuatro', component: ConfiguraCobrosParteCuatroComponent, data: { isEdit: false }},
  { path: 'resumenCobros', component: ResumenCobrosComponent, data: { isEdit: true }},
  { path: 'resumenCobrosAfiliacion', component: ResumenCobrosComponent, data: { isEdit: false }},
  { path: 'editarCobros', component: EditarCobrosComponent, data: { isEdit: true }},

  { path: 'editaCuenta/:llave', component: CrearContrasenaComponent , data: { isEdit: true }},
  { path: 'procesando', component: ProcesandoComponent, canActivate: [LogoutGuard]},
  { path: 'configuracion', component: ConfigurarServiciosComponent},
  { path: 'gtp', component: GtpGrillaComponent,  canActivate: [AuthGuard, GtpInputGuard] },
  { path: 'AprobacionGtp/:llave', component: AprobacionesComponent, canActivate: [AuthGuard, GtpInputGuard]},
  { path: 'configuracionEmpresa', component: ConfigurarEmpresaComponent , canActivate: [AuthGuard, GtpOutputGuard]},
  { path: 'ApGTP/:llave',  component: ConfigurarGtpComponent,  data: { isEdit: true }, canActivate: [AuthGuard, GtpInputGuard]},
  { path: 'ApGTP', component: ConfigurarGtpComponent},
  { path: 'cargaHistorico/:llave', component: CargaHistoricoComponent, canActivate: [AuthGuard, GtpInputGuard] },

  { path: 'subirPlantilla', component: SubirPlantillaComponent},
  { path: 'analisis', component: AnalisisComponent},
  { path: 'notFound', component: PageNotFoundComponent},

  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: '**', redirectTo: 'landing'},

];
export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }


