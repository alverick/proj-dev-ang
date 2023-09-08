import {
  appModuleRoutingNames,
  appRoutingNames,
} from '../../app-routing.names';
import { IRouteItem, IRouteNames } from '../../shared/models/router';
import {
  generateFullRoutes,
  generateFullRoutesTree,
} from '../../shared/utils/helpers/router';

interface IInternalRoutingNames {
  AUTH: string;
  COMPANY: string;
  HELP: string;
  DASHBOARD: string;
  HOME: string;
  SERVICES: string;
}

interface IInternalRoutingChildNames extends IRouteNames {
  SERVICES_LIST: string;
  SERVICES_ADD: string;
  SERVICES_ADD_INFO: string;
  SERVICES_ADD_CONFIGURATION: string;
}

export const internalRoutingNames: IInternalRoutingNames = {
  AUTH: 'auth',
  DASHBOARD: 'resumen',
  HELP: 'ayuda',
  HOME: 'home',
  COMPANY: 'configuracion-empresa',
  SERVICES: 'servicios',
} as const;

export const internalRoutingChildNames: IInternalRoutingChildNames = {
  SERVICES_LIST: 'list',
  SERVICES_ADD: 'agregar',
  SERVICES_ADD_INFO: 'informacion',
  SERVICES_ADD_CONFIGURATION: 'configuracion',
};

export const internalRoutingChildNamesTree: IRouteItem = {
  link: appRoutingNames.EMPTY,
  children: [
    {
      link: internalRoutingNames.SERVICES,
      children: [
        {
          link: internalRoutingChildNames.SERVICES_LIST,
          path: '',
        },
        {
          link: internalRoutingChildNames.SERVICES_ADD,
          children: [
            { link: internalRoutingChildNames.SERVICES_ADD_INFO },
            {
              link: internalRoutingChildNames.SERVICES_ADD_CONFIGURATION,
            },
          ],
        },
      ],
    },
  ],
};

export const internalFullRoutingNames: IInternalRoutingNames = generateFullRoutes(
  internalRoutingNames,
  appModuleRoutingNames
);

export const internalFullRoutingChildNames: IInternalRoutingChildNames =
  generateFullRoutesTree(
    internalRoutingChildNames,
    internalRoutingChildNamesTree
  );
