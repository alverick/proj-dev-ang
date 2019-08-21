import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlynumbersDirective } from './directives/onlynumbers.directive';
import { SearchDirective } from './directives/search.directive'; 
import { DialogComponent } from '../pages/home/dialog'; 

@NgModule({
  imports: [
    CommonModule
  ],providers:[ ],
  declarations: [OnlynumbersDirective,
                 SearchDirective],
  exports: [OnlynumbersDirective,
            SearchDirective]
})
export class SharedModule { }
