import { NgxLoggerLevel } from 'ngx-logger';

import { IEnvironment, serverUrl } from './constants';

export const environment: IEnvironment = {
  development: false,
  production: true,
  hmr: false,
  END_POINT: serverUrl.prod,
  OCP_KEY: '',
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,
};
