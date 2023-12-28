import { NgxLoggerLevel } from 'ngx-logger';

import type { IEnvironment } from './constants';
import { environmentDefault, serverUrl } from './constants';

export const environment: IEnvironment = {
  ...environmentDefault,
  hmr: true,
  END_POINT: serverUrl.local,
  logLevel: NgxLoggerLevel.TRACE,
  serverLogLevel: NgxLoggerLevel.OFF,
  credentials: [['20545692971', 'Interbank*1', 'uat revisar ver detalle']],
};
