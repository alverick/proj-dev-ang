import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

import { type CollectAmount } from '../entities';

@Injectable()
export class CollectAmountService extends EntityCollectionServiceBase<CollectAmount> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('CollectAmount', serviceElementsFactory);
  }
}
