import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CompanyEffects } from './effects/company.effects';
import { companyFeature } from './reducers/company.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(companyFeature),
    EffectsModule.forFeature([CompanyEffects]),
  ],
})
export class EntityStoreModule {}
