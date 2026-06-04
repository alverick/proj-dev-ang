import { NgxLoggerLevel } from 'ngx-logger';

import {
  environmentDefault,
  type IEnvironment,
  Recaptcha,
  serverUrl,
} from './constants';

export const environment: IEnvironment = {
  ...environmentDefault,
  hmr: true,
  END_POINT: serverUrl.dev,
  recaptcha: Recaptcha.hmr,
  logLevel: NgxLoggerLevel.TRACE,
  serverLogLevel: NgxLoggerLevel.OFF,
};
