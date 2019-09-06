import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlynumbersDirective } from './directives/onlynumbers.directive';
import { SearchDirective } from './directives/search.directive';
import { DialogComponent } from '../pages/home/dialog';
import { CorreoDirective } from './directives/correo.directive';
import { NameEnterpiseDirective } from './directives/name-enterpise.directive';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [ ],
  declarations: [
    HeaderComponent,
    OnlynumbersDirective,
    SearchDirective,
    CorreoDirective,
    NameEnterpiseDirective
  ],
  exports: [
    HeaderComponent,
    OnlynumbersDirective,
    SearchDirective,
    CorreoDirective,
    NameEnterpiseDirective
  ]
})
export class SharedModule { }
