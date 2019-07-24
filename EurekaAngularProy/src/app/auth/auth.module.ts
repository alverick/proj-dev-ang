import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AfiliacionComponent } from './afiliacion/afiliacion.component';
import { ConfigurarServiciosComponent } from './configurar-servicios/configurar-servicios.component';
import { ProcesandoComponent } from './procesando/procesando.component';
import { CrearContrasenaComponent } from './crear-contrasena/crear-contrasena.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Optional } from '@angular/core';
import { SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RecaptchaModule } from 'ng-recaptcha';
import { CookieService } from 'ngx-cookie-service';
import { DigitOnlyModule } from '@uiowa/digit-only';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    RecaptchaModule,
    DigitOnlyModule
  ],
  providers: [
    StorageService,
    AuthGuard,
    CookieService
  ],
  declarations: [LoginComponent, AfiliacionComponent, ConfigurarServiciosComponent, ProcesandoComponent, CrearContrasenaComponent]
})

export class AuthModule {
  constructor (@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

 }
