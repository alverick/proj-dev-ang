import { NgxLoggerLevel } from 'ngx-logger';

import { IEnvironment, serverUrl } from './constants';

export const environment: IEnvironment = {
  development: false,
  production: false,
  hmr: false,
  END_POINT: serverUrl.dev,
  OCP_KEY: '',
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,
};
