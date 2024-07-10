import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppConfigEffects } from './effects/app-config.effects';
import { CompanyEffects } from './effects/company.effects';
import { appConfigFeature } from './reducers/app-config.reducer';
import { companyFeature } from './reducers/company.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(companyFeature),
    EffectsModule.forFeature([CompanyEffects]),
  ],
})
export class EntityStoreModule {}
