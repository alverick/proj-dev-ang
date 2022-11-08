import { appRoutingNames } from 'src/app/app-routing.names';
import { generateFullRoutes } from 'src/app/shared/utils/helpers/router';

interface IPublicRoutingNames {
  AFFILIATION?: string;
}

const publicModuleRoutingPath = `/${appRoutingNames.LANDING}`;

export const publicRoutingNames: IPublicRoutingNames = {
  AFFILIATION: 'afiliacion',
};

export const publicFullRoutingNames: IPublicRoutingNames = generateFullRoutes(
  publicRoutingNames,
  publicModuleRoutingPath
);
