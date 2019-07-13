import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { AnalisisComponent } from './pages/analisis/analisis.component';
import { SubirPlantillaComponent } from './pages/subir-plantilla/subir-plantilla.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from 'src/app/auth/auth.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fakeBackendProvider } from 'src/app/shared/helpers/fake-backend';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RecaptchaModule } from 'ng-recaptcha';
import { DigitOnlyModule } from '@uiowa/digit-only';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AnalisisComponent,
    SubirPlantillaComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AuthModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    NgxSpinnerModule,
    MatInputModule,
    SweetAlert2Module.forRoot(),  
    RecaptchaModule.forRoot(),
    DigitOnlyModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule

  ],
  providers: [
     fakeBackendProvider,
     {provide: ErrorStateMatcher,
      useClass: ShowOnDirtyErrorStateMatcher
      },
      
  ],
  exports:[
    MatInputModule,
    
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
