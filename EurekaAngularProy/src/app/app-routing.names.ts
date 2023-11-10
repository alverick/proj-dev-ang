import { generateFullRoutes } from './shared/utils/helpers/router';

interface IAppRoutingNames {
  AUTH: string;
  LANDING: string;
  INTERNAL: string;
  ADMIN: string;
  EMPTY: string;
}

export const appModuleRoutingNames = '/';

export const appRoutingNames: IAppRoutingNames = {
  EMPTY: '',
  LANDING: 'landing',
  INTERNAL: '',
  ADMIN: 'gtp',
  AUTH: '',
};

export const appFullRoutingNames: IAppRoutingNames = generateFullRoutes(
  appRoutingNames,
  appModuleRoutingNames
);
