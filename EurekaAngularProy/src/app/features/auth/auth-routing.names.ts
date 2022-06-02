import { appRoutingNames } from 'src/app/app-routing.names';
import { generateFullRoutes } from '../../shared/utils/helpers/router';

const authModuleRoutingNames = `/${appRoutingNames.AUTH}/`;

interface IAuthRoutingNames {
  CHANGE_PASSWORD: string;
  COMPANY_CONFIGURATION?: string;
  COMPANY_FILL_DATA?: string;
  COMPANY_FINISHED?: string;
  COMPANY_REGISTER?: string;
  CONFIGURATION?: string;
  GENERATE_PASSWORD?: string;
  LOGIN?: string;
  PROCESSING?: string;
  RECOVER_PASSWORD?: string;
  SERVICES_CONFIGURE?: string;
  SERVICES_EDIT?: string;
  SERVICES_EDIT_GTP?: string;
}

export const authRoutingNames: IAuthRoutingNames = {
  CHANGE_PASSWORD: 'cambiar-contrasena',
  COMPANY_CONFIGURATION: 'empresa-configuracion',
  COMPANY_FILL_DATA: 'empresa-completar-datos',
  COMPANY_FINISHED: 'registro-completado',
  COMPANY_REGISTER: 'empresa-registro',
  CONFIGURATION: 'configuracion',
  GENERATE_PASSWORD: 'generar-contrasena',
  LOGIN: 'login',
  PROCESSING: 'procesando',
  RECOVER_PASSWORD: 'recuperar-contrasena',
  SERVICES_CONFIGURE: 'configurar-servicios',
  SERVICES_EDIT: 'editar-servicios',
  SERVICES_EDIT_GTP: 'gtp-editar-servicios',
};
export const authDynamicRoutingNames: IAuthRoutingNames = {
  CHANGE_PASSWORD: `${authRoutingNames.CHANGE_PASSWORD}/:llave`,
  COMPANY_CONFIGURATION: `${authRoutingNames.COMPANY_CONFIGURATION}/:llave`,
  GENERATE_PASSWORD: `${authRoutingNames.GENERATE_PASSWORD}/:llave`,
};

export const authFullRoutingNames: IAuthRoutingNames = generateFullRoutes(
  authRoutingNames,
  authModuleRoutingNames
);

export const authFullDynamicRoutingNames: IAuthRoutingNames =
  generateFullRoutes(authDynamicRoutingNames, authModuleRoutingNames);
