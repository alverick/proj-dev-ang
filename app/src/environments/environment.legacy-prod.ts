import { NgxLoggerLevel } from 'ngx-logger';

import {
  environmentDefault,
  type IEnvironment,
  Recaptcha,
  serverUrl,
} from './constants';

export const environment: IEnvironment = {
  ...environmentDefault,
  development: false,
  production: true,
  END_POINT: serverUrl.prod,
  recaptcha: Recaptcha.legacyProd,
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,
  adobe:
    'https://assets.adobedtm.com/df637a308f4c/ec7ac20e39e1/launch-f36536511e92.min.js',
  hotjarSiteId: '2944859',
  hotjarVersion: '6',
  dynatrace:
    'https://dok.js-cdn.dynatrace.com/jstag/18ecc485038/bf23299knm/e5b3bea2b05a025e_complete.js',
};
