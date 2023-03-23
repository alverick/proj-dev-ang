import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

import { TopClient } from '../entities/TopClient';

@Injectable({
  providedIn: 'root',
})
export class TopClientService extends EntityCollectionServiceBase<TopClient> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('TopClient', serviceElementsFactory);
  }
}
