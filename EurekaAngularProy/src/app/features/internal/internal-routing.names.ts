import {
  appModuleRoutingNames,
  appRoutingNames,
} from 'src/app/app-routing.names';
import { IRouteItem, IRouteNames } from '../../shared/models/router';
import {
  generateFullRoutes,
  generateFullRoutesTree,
} from '../../shared/utils/helpers/router';

interface IInternalRoutingNames {
  AUTH: string;
  COMPANY: string;
  HELP: string;
  HOME: string;
  SERVICES: string;
}

interface IInternalRoutingChildNames extends IRouteNames {
  SERVICES_LIST: string;
  SERVICES_ADD: string;
  SERVICES_ADD_INFO: string;
  SERVICES_ADD_CONFIGURATION: string;
}

interface IInternalAuthRoutingNames {
  CHARGES_AFFILIATION: string;
  CHARGES_AFFILIATION_EDIT: string;
  CHARGES_AFFILIATION_ADD_STEP_1: string;
  CHARGES_AFFILIATION_ADD_STEP_2: string;
  CHARGES_AFFILIATION_ADD_STEP_3: string;
  CHARGES_AFFILIATION_ADD_STEP_4: string;
}

export const internalRoutingNames: IInternalRoutingNames = {
  AUTH: 'auth',
  HELP: 'ayuda',
  HOME: 'home',
  COMPANY: 'configuracion-empresa',
  SERVICES: 'servicios',
};

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

export const internalAuthModuleRoutingNames = `/${internalRoutingNames.AUTH}/`;

export const internalAuthRoutingNames: IInternalAuthRoutingNames = {
  CHARGES_AFFILIATION: 'cobros-afiliacion',
  CHARGES_AFFILIATION_EDIT: 'cobros-afiliacion-editar',
  CHARGES_AFFILIATION_ADD_STEP_1: 'cobros-agregar-paso-1',
  CHARGES_AFFILIATION_ADD_STEP_2: 'cobros-agregar-paso-2',
  CHARGES_AFFILIATION_ADD_STEP_3: 'cobros-agregar-paso-3',
  CHARGES_AFFILIATION_ADD_STEP_4: 'cobros-agregar-paso-4',
};

export const internalFullRoutingNames: IInternalRoutingNames =
  generateFullRoutes(internalRoutingNames, appModuleRoutingNames);

export const internalFullRoutingChildNames: IInternalRoutingChildNames =
  generateFullRoutesTree(
    internalRoutingChildNames,
    internalRoutingChildNamesTree
  );

export const internalAuthFullRoutingNames: IInternalAuthRoutingNames =
  generateFullRoutes(internalAuthRoutingNames, internalAuthModuleRoutingNames);
