import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import { LoginService } from 'src/app/shared/services/login.service';


import { fakeBackendProvider } from 'src/app/shared/helpers/fake-backend';
import { timeoutWith } from 'rxjs/operators';




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
    HttpModule


    
    
  ],
  providers: [
    
     fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
