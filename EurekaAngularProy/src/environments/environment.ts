import { serverUrl, IEnvironment } from './constants';

export const environment: IEnvironment = {
  production: false,
  development: true,
  hmr: false,
  END_POINT: serverUrl.local,
  OCP_KEY: '',
};
