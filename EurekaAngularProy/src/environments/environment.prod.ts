import { NgxLoggerLevel } from 'ngx-logger';

import type { IEnvironment } from './constants';
import { environmentDefault, serverUrl } from './constants';

export const environment: IEnvironment = {
  ...environmentDefault,
  development: false,
  production: true,
  END_POINT: serverUrl.prod,
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,
};
