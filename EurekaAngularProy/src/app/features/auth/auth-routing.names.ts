import { appRoutingNames } from 'src/app/app-routing.names';
import {
  generateFullRoutes,
  generateFullRoutesTree,
} from '../../shared/utils/helpers/router';

const authModuleRoutingPath = `/${appRoutingNames.AUTH}/`;

interface IAuthRoutingNames {
  CHANGE_PASSWORD?: string;
  COMPANY_CONFIGURATION?: string;
  COMPANY_FILL_DATA?: string;
  COMPANY_FINISHED?: string;
  REGISTRATION_FINISHED?: string;
  COMPANY_REGISTER?: string;
  CONFIGURATION?: string;
  GENERATE_PASSWORD?: string;
  LOGIN?: string;
  PROCESSING?: string;
  RECOVER_PASSWORD?: string;
  SERVICES_CONFIGURE?: string;
  SERVICES_EDIT?: string;
  SERVICES_EDIT_GTP?: string;
  SERVICES_ADD?: string;
}

interface IAuthRoutingChildNames {
  SERVICES_ADD_INFO?: string;
  SERVICES_ADD_CONFIGURATION?: string;
  SERVICES_ADD_LIST?: string;
}

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
};

export const authRoutingChildNames: IAuthRoutingChildNames = {
  SERVICES_ADD_INFO: 'informacion',
  SERVICES_ADD_CONFIGURATION: 'configuration',
  SERVICES_ADD_LIST: 'resumen',
};

interface IAuthItem {
  link: string;
  key?: string;
  children?: IAuthItem[];
}

export const authRoutingChildNamesTree: IAuthItem = {
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
};

export const authDynamicRoutingNames: IAuthRoutingNames = {
  CHANGE_PASSWORD: `${authRoutingNames.CHANGE_PASSWORD}/:llave`,
  COMPANY_CONFIGURATION: `${authRoutingNames.COMPANY_CONFIGURATION}/:llave`,
  GENERATE_PASSWORD: `${authRoutingNames.GENERATE_PASSWORD}/:llave`,
};

export const authFullRoutingNames: IAuthRoutingNames = generateFullRoutes(
  authRoutingNames,
  authModuleRoutingPath
);

export const authFullRoutingChildNames: IAuthRoutingChildNames =
  generateFullRoutesTree(
    authRoutingChildNames,
    authRoutingChildNamesTree,
    authModuleRoutingPath
  );
console.table(authFullRoutingNames);

export const authFullDynamicRoutingNames: IAuthRoutingNames =
  generateFullRoutes(authDynamicRoutingNames, authModuleRoutingPath);
