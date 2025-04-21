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
  adobe:
    'https://assets.adobedtm.com/df637a308f4c/ec7ac20e39e1/launch-f36536511e92.min.js',
  hotjarSiteId: 2944859,
  hotjarVersion: 6,
};
