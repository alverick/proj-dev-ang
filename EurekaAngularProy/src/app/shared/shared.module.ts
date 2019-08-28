import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlynumbersDirective } from './directives/onlynumbers.directive';
import { SearchDirective } from './directives/search.directive'; 
import { DialogComponent } from '../pages/home/dialog'; 
import { CorreoDirective } from './directives/correo.directive';
import { NameEnterpiseDirective } from './directives/name-enterpise.directive';

@NgModule({
  imports: [
    CommonModule
  ],providers:[ ],
  declarations: [OnlynumbersDirective,
                 SearchDirective,
                 CorreoDirective,
                 NameEnterpiseDirective],
  exports: [OnlynumbersDirective,
            SearchDirective,
            CorreoDirective,
            NameEnterpiseDirective]
})
export class SharedModule { }
