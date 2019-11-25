import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { AfiliacionComponent } from 'src/app/auth/afiliacion/afiliacion.component';
import { SubirPlantillaComponent } from 'src/app/pages/subir-plantilla/subir-plantilla.component';
import { ConfigurarServiciosComponent } from 'src/app/auth/configurar-servicios/configurar-servicios.component';
import { CrearContrasenaComponent } from 'src/app/auth/crear-contrasena/crear-contrasena.component';
import { ProcesandoComponent } from 'src/app/auth/procesando/procesando.component';
import { AnalisisComponent } from 'src/app/pages/analisis/analisis.component';
import { PageNotFoundComponent } from 'src/app/pages/page-not-found/page-not-found.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { LogoutGuard } from './shared/guards/logout.guard';
import { ConfigurarEmpresaComponent } from './pages/configurar-empresa/configurar-empresa.component';
import { CloseViewGuard } from './shared/guards/close-view.guard';
import { ClientGuard } from './shared/guards/client.guard';
import { RecuperarContrasenaComponent } from './auth/recuperar-contrasena/recuperar-contrasena.component';
import { CambiaContrasenaComponent } from './auth/cambia-contrasena/cambia-contrasena.component';
import { GtpGrillaComponent } from './pages/gtp-grilla/gtp-grilla.component';
import { AprobacionesComponent } from './pages/aprobaciones/aprobaciones.component';
import { GtpInputGuard } from './shared/guards/gtp-input.guard';
import { GtpOutputGuard } from './shared/guards/gtp-output.guard';
import { ConfigurarGtpComponent } from './auth/configurar-gtp/configurar-gtp.component';

// CambiaContrasenaComponent

const routes: Routes = [
  { path: 'home', component: HomeComponent ,   canActivate: [AuthGuard , GtpOutputGuard] },
  { path: 'login', component: LoginComponent , canActivate: [LogoutGuard]},
  //{ path: 'cambiaContra/:llave', component: CambiaContrasenaComponent , canActivate: [LogoutGuard]},
  //{ path: 'recupera', component: RecuperarContrasenaComponent , canActivate: [LogoutGuard]},
  { path: 'afiliacion', component: AfiliacionComponent, canActivate: [LogoutGuard]},
  //{ path: 'editarSvcGTP', component: ConfigurarServiciosComponent, data: {  isgtp: true }},
  { path: 'configurarServicios', component: ConfigurarServiciosComponent, data: { isEdit: false }, canActivate: [ClientGuard] },
  //{ path: 'editarServicios', component: ConfigurarServiciosComponent, data: { isEdit: true }, canActivate: [ AuthGuard, GtpOutputGuard ] },
  { path: 'crearContrasena', component: CrearContrasenaComponent, data: { isEdit: false }},
  //{ path: 'editaCuenta/:llave', component: CrearContrasenaComponent , data: { isEdit: true }},
  { path: 'procesando', component: ProcesandoComponent, canActivate: [LogoutGuard]},
  { path: 'configuracion', component: ConfigurarServiciosComponent},
  { path: 'gtp', component: GtpGrillaComponent,  canActivate: [AuthGuard, GtpInputGuard] },
  { path: 'AprobacionGtp/:llave', component: AprobacionesComponent, canActivate: [AuthGuard, GtpInputGuard]},
  //{ path: 'configuracionEmpresa', component: ConfigurarEmpresaComponent , canActivate: [AuthGuard, GtpOutputGuard]},
  { path: 'ApGTP/:llave',  component: ConfigurarGtpComponent,  data: { isEdit: true }, canActivate: [AuthGuard, GtpInputGuard]},
  // { path: 'ApGTP', component: ConfigurarGtpComponent},

  { path: 'subirPlantilla', component: SubirPlantillaComponent},
  { path: 'analisis', component: AnalisisComponent},
  { path: 'notFound', component: PageNotFoundComponent},

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login'},

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


