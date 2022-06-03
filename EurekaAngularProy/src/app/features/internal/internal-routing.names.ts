import { appModuleRoutingNames } from 'src/app/app-routing.names';
import { generateFullRoutes } from '../../shared/utils/helpers/router';

interface IInternalRoutingNames {
  AUTH: string;
  CHARGES: string;
  CHARGES_ADD_STEP_1: string;
  CHARGES_ADD_STEP_2: string;
  CHARGES_ADD_STEP_3: string;
  CHARGES_ADD_STEP_4: string;
  CHARGES_AFFILIATION: string;
  CHARGES_AFFILIATION_EDIT: string;
  CHARGES_EDIT: string;
  COMPANY: string;
  HOME: string;
}

interface IInternalAuthRoutingNames {
  CHARGES_AFFILIATION_ADD_STEP_1: string;
  CHARGES_AFFILIATION_ADD_STEP_2: string;
  CHARGES_AFFILIATION_ADD_STEP_3: string;
  CHARGES_AFFILIATION_ADD_STEP_4: string;
}

export const internalRoutingNames: IInternalRoutingNames = {
  AUTH: 'auth',
  HOME: 'home',
  COMPANY: 'configuracion-empresa',
  CHARGES: 'cobros-resumen',
  CHARGES_AFFILIATION: 'cobros-afiliacion',
  CHARGES_EDIT: 'cobros-editar',
  CHARGES_AFFILIATION_EDIT: 'cobros-afiliacion-editar',
  CHARGES_ADD_STEP_1: 'cobros-agregar-paso-1',
  CHARGES_ADD_STEP_2: 'cobros-agregar-paso-2',
  CHARGES_ADD_STEP_3: 'cobros-agregar-paso-3',
  CHARGES_ADD_STEP_4: 'cobros-agregar-paso-4',
};

export const internalAuthModuleRoutingNames = `/${internalRoutingNames.AUTH}/`;

export const internalAuthRoutingNames: IInternalAuthRoutingNames = {
  CHARGES_AFFILIATION_ADD_STEP_1: 'cobros-agregar-paso-1',
  CHARGES_AFFILIATION_ADD_STEP_2: 'cobros-agregar-paso-2',
  CHARGES_AFFILIATION_ADD_STEP_3: 'cobros-agregar-paso-3',
  CHARGES_AFFILIATION_ADD_STEP_4: 'cobros-agregar-paso-4',
};

export const internalFullRoutingNames: IInternalRoutingNames =
  generateFullRoutes(internalRoutingNames, appModuleRoutingNames);

export const internalAuthFullRoutingNames: IInternalAuthRoutingNames =
  generateFullRoutes(internalAuthRoutingNames, internalAuthModuleRoutingNames);
