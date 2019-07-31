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

const routes: Routes = [
  { path: 'home', component: HomeComponent,   canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LogoutGuard]},

  { path: 'afiliacion', component: AfiliacionComponent},
  { path: 'configurarServicios', component: ConfigurarServiciosComponent},
  { path: 'crearContrasena', component: CrearContrasenaComponent},
  { path: 'procesando', component: ProcesandoComponent},

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


