import { appModuleRoutingNames } from '../../app-routing.names';
import { generateFullRoutes } from '../../shared/utils/helpers/router';

interface IPublicRoutingNames {
  AFFILIATION?: string;
}

export const publicRoutingNames: IPublicRoutingNames = {
  AFFILIATION: 'afiliacion',
};

export const publicFullRoutingNames: IPublicRoutingNames = generateFullRoutes(
  publicRoutingNames,
  appModuleRoutingNames
);
