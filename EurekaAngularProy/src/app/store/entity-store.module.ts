import { NgModule } from '@angular/core';
import { EntityDataModule, EntityDataService } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';
import {
  CollectAmountDataService,
  DATA_SERVICES,
  HistoricalCollectDataService,
  TopClientDataService,
} from './dataservices';
import { AppConfigEffects } from './effects/app-config.effects';
import { CompanyEffects } from './effects/company.effects';
import { entityConfig } from './entity-metadata';
import { appConfigFeature } from './reducers/app-config.reducer';
import { companyFeature } from './reducers/company.reducer';

@NgModule({
  imports: [
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
        },
      }
    ),
    StoreModule.forFeature(companyFeature),
    StoreModule.forFeature(appConfigFeature),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EntityDataModule.forRoot(entityConfig),
    EffectsModule.forFeature([CompanyEffects, AppConfigEffects]),
  ],
  providers: [...DATA_SERVICES],
})
export class EntityStoreModule {
  constructor(
    entityDataService: EntityDataService,
    collectAmountDataService: CollectAmountDataService,
    historicalCollectDataService: HistoricalCollectDataService,
    topClientDataService: TopClientDataService
  ) {
    entityDataService.registerService(
      'CollectAmount',
      collectAmountDataService
    );
    entityDataService.registerService(
      'HistoricalCollect',
      historicalCollectDataService
    );
    entityDataService.registerService('TopClient', topClientDataService);
  }
}
