import { appRoutingNames } from '../../app-routing.names';
import { type IRouteItem, type IRouteNames } from '../../shared/models/router';
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

const internalModuleRoutingPath = `/${appRoutingNames.INTERNAL}/`;

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
  link: appRoutingNames.INTERNAL,
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

export const internalFullRoutingNames: IInternalRoutingNames =
  generateFullRoutes(internalRoutingNames, internalModuleRoutingPath);

export const internalFullRoutingChildNames: IInternalRoutingChildNames =
  generateFullRoutesTree(
    internalRoutingChildNames,
    internalRoutingChildNamesTree
  );
