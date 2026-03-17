import { NgxLoggerLevel } from 'ngx-logger';

import type { IEnvironment } from './constants';
import { environmentDefault, serverUrl } from './constants';

export const environment: IEnvironment = {
  ...environmentDefault,
  hmr: true,
  END_POINT: serverUrl.local,
  logLevel: NgxLoggerLevel.TRACE,
  serverLogLevel: NgxLoggerLevel.OFF,
  dynatrace:
    'https://dok.js-cdn.dynatrace.com/jstag/18ecc485038/bf02472ovk/a8a689599f93b815_complete.js',
};
