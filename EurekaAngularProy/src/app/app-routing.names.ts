import { generateFullRoutes } from './shared/utils/helpers/router';

interface IAppRoutingNames {
  AUTH: string;
  LANDING: string;
  ADMIN: string;
  EMPTY: string;
}

export const appModuleRoutingNames = '/';

export const appRoutingNames: IAppRoutingNames = {
  EMPTY: '',
  LANDING: 'landing',
  ADMIN: 'gtp',
  AUTH: 'auth',
};

export const appFullRoutingNames: IAppRoutingNames = generateFullRoutes(
  appRoutingNames,
  appModuleRoutingNames
);
