import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CorreoDirective } from './directives/correo.directive';
import { NameEnterpiseDirective } from './directives/name-enterpise.directive';
import { OnlynumbersDirective } from './directives/onlynumbers.directive';
import { SearchDirective } from './directives/search.directive';

@NgModule({
  imports: [CommonModule],
  providers: [],
  declarations: [
    OnlynumbersDirective,
    SearchDirective,
    CorreoDirective,
    NameEnterpiseDirective,
  ],
  exports: [
    OnlynumbersDirective,
    SearchDirective,
    CorreoDirective,
    NameEnterpiseDirective,
  ],
})
export class SharedModule {}
