import { NgxLoggerLevel } from 'ngx-logger';

import type { IEnvironment } from './constants';
import { environmentDefault, serverUrl } from './constants';

export const environment: IEnvironment = {
  ...environmentDefault,
  development: false,
  production: true,
  END_POINT: serverUrl.uat,
  recaptcha: '6Ldpcp4rAAAAAErayT0V1vXFOih8hbzr5ZltvUP_',
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,
  adobe:
    'https://assets.adobedtm.com/df637a308f4c/ec7ac20e39e1/launch-1a12f3644aa0-staging.min.js',
  dynatrace:
    'https://dok.js-cdn.dynatrace.com/jstag/18ecc485038/bf02472ovk/a8a689599f93b815_complete.js',
};
