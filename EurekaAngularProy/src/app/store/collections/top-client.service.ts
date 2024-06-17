import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

import { type TopClient } from '../entities';

@Injectable()
export class TopClientService extends EntityCollectionServiceBase<TopClient> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('TopClient', serviceElementsFactory);
  }
}
