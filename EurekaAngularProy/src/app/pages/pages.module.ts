import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CorrigeComponent } from './corrige/corrige.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [CorrigeComponent],
})
export class PagesModule {
  constructor(@Optional() @SkipSelf() parentModule: PagesModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
