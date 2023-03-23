import { NgModule } from '@angular/core';
import { EntityDataModule, EntityDataService } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';
import {
  DATA_SERVICES,
  HistoricalCollectDataService,
  CollectAmountDataService,
  TopClientDataService,
} from './dataservices';
import { entityConfig } from './entity-metadata';

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
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EntityDataModule.forRoot(entityConfig),
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
