import { appRoutingNames } from 'src/app/app-routing.names';

import { IRouteItem, IRouteNames } from '../../shared/models/router';
import {
  generateFullRoutes,
  generateFullRoutesTree,
} from '../../shared/utils/helpers/router';

interface IAuthRoutingNames extends IRouteNames {
  CHANGE_PASSWORD: string;
  COMPANY_CONFIGURATION: string;
  COMPANY_FILL_DATA: string;
  COMPANY_FINISHED: string;
  REGISTRATION_FINISHED: string;
  COMPANY_REGISTER: string;
  CONFIGURATION: string;
  GENERATE_PASSWORD: string;
  LOGIN: string;
  PROCESSING: string;
  RECOVER_PASSWORD: string;
  SERVICES_CONFIGURE: string;
  SERVICES_EDIT: string;
  SERVICES_EDIT_GTP: string;
  SERVICES_ADD: string;
  REGISTER_UPDATING: string;
  REGISTER_UPDATING_VALIDATION: string;
}

interface IAuthRoutingChildNames extends IRouteNames {
  SERVICES_ADD_INFO: string;
  SERVICES_ADD_CONFIGURATION: string;
  SERVICES_ADD_LIST: string;
  UPDATE_COMPANY: string;
  UPDATE_SERVICES: string;
}

const authModuleRoutingPath = `/`;

export const authRoutingNames: IAuthRoutingNames = {
  CHANGE_PASSWORD: 'cambiar-contrasena',
  COMPANY_CONFIGURATION: 'empresa-configuracion',
  COMPANY_FILL_DATA: 'empresa-completar-datos',
  COMPANY_REGISTER: 'empresa-registro',
  COMPANY_FINISHED: 'registro-completado',
  REGISTRATION_FINISHED: 'registro-finalizado',
  CONFIGURATION: 'configuracion',
  GENERATE_PASSWORD: 'generar-contrasena',
  LOGIN: 'login',
  PROCESSING: 'procesando',
  RECOVER_PASSWORD: 'recuperar-contrasena',
  SERVICES_CONFIGURE: 'configurar-servicios',
  SERVICES_EDIT: 'editar-servicios',
  SERVICES_EDIT_GTP: 'gtp-editar-servicios',
  SERVICES_ADD: 'agregar-servicio',
  REGISTER_UPDATING: 'actualizacion',
  REGISTER_UPDATING_VALIDATION: 'validacion',
};

export const authRoutingChildNames: IAuthRoutingChildNames = {
  SERVICES_ADD_INFO: 'informacion',
  SERVICES_ADD_CONFIGURATION: 'configuracion',
  SERVICES_ADD_LIST: 'resumen',
  UPDATE_COMPANY: 'empresa',
  UPDATE_SERVICES: 'servicios',
};

export const authRoutingChildNamesTree: IRouteItem = {
  link: appRoutingNames.AUTH,
  children: [
    {
      link: authRoutingNames.SERVICES_ADD,
      children: [
        { link: authRoutingChildNames.SERVICES_ADD_INFO },
        {
          link: authRoutingChildNames.SERVICES_ADD_CONFIGURATION,
        },
        {
          link: authRoutingChildNames.SERVICES_ADD_LIST,
        },
      ],
    },
    {
      link: authRoutingNames.REGISTER_UPDATING,
      children: [
        { link: authRoutingChildNames.UPDATE_COMPANY },
        { link: authRoutingChildNames.UPDATE_SERVICES },
      ],
    },
  ],
};

export const authDynamicRoutingNames: Partial<IAuthRoutingNames> = {
  CHANGE_PASSWORD: `${authRoutingNames.CHANGE_PASSWORD}/:llave`,
  COMPANY_CONFIGURATION: `${authRoutingNames.COMPANY_CONFIGURATION}/:llave`,
  GENERATE_PASSWORD: `${authRoutingNames.GENERATE_PASSWORD}/:llave`,
  REGISTER_UPDATING_VALIDATION: `${authRoutingNames.REGISTER_UPDATING_VALIDATION}/:token`,
};

export const authFullRoutingNames: IAuthRoutingNames = generateFullRoutes(
  authRoutingNames,
  authModuleRoutingPath
);

export const authFullRoutingChildNames: IAuthRoutingChildNames =
  generateFullRoutesTree(authRoutingChildNames, authRoutingChildNamesTree);

export const authFullDynamicRoutingNames: IAuthRoutingNames =
  generateFullRoutes(authDynamicRoutingNames, authModuleRoutingPath);
