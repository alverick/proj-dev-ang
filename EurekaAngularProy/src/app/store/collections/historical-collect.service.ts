import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

import { HistoricalCollect } from '../entities';

@Injectable({
  providedIn: 'root',
})
export class HistoricalCollectService extends EntityCollectionServiceBase<HistoricalCollect> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('HistoricalCollect', serviceElementsFactory);
  }
}
