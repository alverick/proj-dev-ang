import { appModuleRoutingNames } from 'src/app/app-routing.names';
import { generateFullRoutes } from 'src/app/shared/utils/helpers/router';

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
