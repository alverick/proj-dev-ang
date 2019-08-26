import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlynumbersDirective } from './directives/onlynumbers.directive';
import { SearchDirective } from './directives/search.directive'; 
import { DialogComponent } from '../pages/home/dialog'; 
import { CorreoDirective } from './directives/correo.directive';

@NgModule({
  imports: [
    CommonModule
  ],providers:[ ],
  declarations: [OnlynumbersDirective,
                 SearchDirective,
                 CorreoDirective],
  exports: [OnlynumbersDirective,
            SearchDirective,
            CorreoDirective]
})
export class SharedModule { }
