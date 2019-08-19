import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlynumbersDirective } from './directives/onlynumbers.directive';
import { SearchDirective } from './directives/search.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  // modular
  declarations: [OnlynumbersDirective,
                 SearchDirective],
  exports: [OnlynumbersDirective,
            SearchDirective]
})
export class SharedModule { }
