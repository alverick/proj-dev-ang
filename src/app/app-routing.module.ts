import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { AfiliacionComponent } from 'src/app/auth/afiliacion/afiliacion.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path:'login', component: LoginComponent },
  { path: 'affiliation', component: AfiliacionComponent},
  { path: '**', component: HomeComponent}
]; 

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],    
  exports:[
    RouterModule
  ], 
  declarations: []
})
export class AppRoutingModule { }
