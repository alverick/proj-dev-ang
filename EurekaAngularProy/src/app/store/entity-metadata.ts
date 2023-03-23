import { EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data';

import { HistoricalCollect, TopClient } from './entities';

const entityMetadata: EntityMetadataMap = {
  CollectAmount: {},
  HistoricalCollect: {
    selectId: (historicalCollect: HistoricalCollect) =>
      historicalCollect.service,
  },
  TopClient: {
    selectId: (topClient: TopClient) => topClient.code + topClient.service,
  },
};

const pluralNames = {
  CollectAmount: 'CollectAmounts',
  HistoricalCollect: 'HistoricalCollects',
  TopClient: 'TopClients',
};

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames,
};
