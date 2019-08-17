import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlynumbersDirective } from './directives/onlynumbers.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  // modular
  declarations: [OnlynumbersDirective],
  exports: [OnlynumbersDirective]
})
export class SharedModule { }
