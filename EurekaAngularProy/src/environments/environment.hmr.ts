import { NgxLoggerLevel } from 'ngx-logger';
import { serverUrl, IEnvironment } from './constants';

export const environment: IEnvironment = {
  production: false,
  hmr: true,
  development: true,
  END_POINT: serverUrl.local,
  OCP_KEY: '',
  logLevel: NgxLoggerLevel.TRACE,
  serverLogLevel: NgxLoggerLevel.OFF,
};
