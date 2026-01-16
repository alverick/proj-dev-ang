import { NgxLoggerLevel } from 'ngx-logger';

import type { IEnvironment } from './constants';
import { environmentDefault, serverUrl } from './constants';

export const environment: IEnvironment = {
  ...environmentDefault,
  development: false,
  END_POINT: serverUrl.dev,
  recaptcha: '6Ldocp4rAAAAAE26XlG3fIe2b_0hBhE3LrLRXGJn',
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,
  adobe:
    'https://assets.adobedtm.com/df637a308f4c/ec7ac20e39e1/launch-ed1665d4f083-development.min.js',
  dynatrace:
    'https://dok.js-cdn.dynatrace.com/jstag/18ecc485038/bf02472ovk/a8a689599f93b815_complete.js',
};
