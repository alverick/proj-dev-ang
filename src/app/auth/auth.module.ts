import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AfiliacionComponent } from './afiliacion/afiliacion.component';
import { ConfigurarServiciosComponent } from './configurar-servicios/configurar-servicios.component';
import { ProcesandoComponent } from './procesando/procesando.component';
import { CrearContrasenaComponent } from './crear-contrasena/crear-contrasena.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoginComponent, AfiliacionComponent, ConfigurarServiciosComponent, ProcesandoComponent, CrearContrasenaComponent]
})
export class AuthModule { }
