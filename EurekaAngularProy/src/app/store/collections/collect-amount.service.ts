import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

import { CollectAmount } from '../entities/CollectAmount';

@Injectable({
  providedIn: 'root',
})
export class CollectAmountService extends EntityCollectionServiceBase<CollectAmount> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('CollectAmount', serviceElementsFactory);
  }
}
