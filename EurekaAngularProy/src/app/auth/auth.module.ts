import { LogoutGuard } from './../shared/guards/logout.guard';
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
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { BlockCopyPasteDirective } from './login/block-copy-paste.directive';
import { FormServicioComponent } from './form-servicio/form-servicio.component';
import { OnlyNumbersFormDirective } from './form-servicio/only-numbers-form.directive';
import { CloseViewGuard } from '../shared/guards/close-view.guard';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    RecaptchaModule,
    DigitOnlyModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedModule
  ],
  providers: [
    StorageService,
    AuthGuard,
    CookieService,
    LogoutGuard,
    CloseViewGuard,
  ],
  declarations: [
    LoginComponent,
    AfiliacionComponent,
    ConfigurarServiciosComponent,
    FormServicioComponent,
    ProcesandoComponent,
    CrearContrasenaComponent,
    BlockCopyPasteDirective,
    OnlyNumbersFormDirective
  ]
})

export class AuthModule {
  constructor (@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
 }
