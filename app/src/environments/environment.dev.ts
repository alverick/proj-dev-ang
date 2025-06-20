import { NgxLoggerLevel } from 'ngx-logger';

import type { IEnvironment } from './constants';
import { environmentDefault, serverUrl } from './constants';

export const environment: IEnvironment = {
  ...environmentDefault,
  development: false,
  END_POINT: serverUrl.dev,
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,
  adobe:
    'https://assets.adobedtm.com/df637a308f4c/ec7ac20e39e1/launch-ed1665d4f083-development.min.js',
};
