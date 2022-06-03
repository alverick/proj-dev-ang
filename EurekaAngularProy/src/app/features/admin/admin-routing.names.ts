import { appFullRoutingNames } from 'src/app/app-routing.names';

export const adminRoutingNames = {
  APPROVE: 'aprobacion',
  HISTORY: 'historial-cargas',
  SETUP_EMAIL: 'configurar-correo',
};
export const adminDynamicRoutingNames = {
  APPROVE: `${adminRoutingNames.APPROVE}/:llave`,
  HISTORY: `${adminRoutingNames.HISTORY}/:llave`,
};
export const adminFullRoutingNames = {
  APPROVE: `${appFullRoutingNames.ADMIN}/${adminRoutingNames.APPROVE}/`,
  HISTORY: `${appFullRoutingNames.ADMIN}/${adminRoutingNames.HISTORY}/`,
  SETUP_EMAIL: `${appFullRoutingNames.ADMIN}/${adminRoutingNames.SETUP_EMAIL}`,
};
