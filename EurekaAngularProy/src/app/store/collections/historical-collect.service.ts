import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

import { type HistoricalCollect } from '../entities';

@Injectable({
  providedIn: 'root',
})
export class HistoricalCollectService extends EntityCollectionServiceBase<HistoricalCollect> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('HistoricalCollect', serviceElementsFactory);
  }
}
