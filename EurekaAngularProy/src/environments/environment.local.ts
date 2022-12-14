import { NgxLoggerLevel } from 'ngx-logger';
import { serverUrl, IEnvironment } from './constants';

export const environment: IEnvironment = {
  development: false,
  production: false,
  hmr: false,
  END_POINT: serverUrl.local,
  OCP_KEY: '',
  logLevel: NgxLoggerLevel.WARN,
  serverLogLevel: NgxLoggerLevel.OFF,
};
