import { serverUrl, IEnvironment } from './constants';

export const environment: IEnvironment = {
  development: false,
  production: true,
  hmr: false,
  END_POINT: serverUrl.uat,
  OCP_KEY: '',
};
