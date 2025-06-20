import { NgxLoggerLevel } from 'ngx-logger';

import type { IEnvironment } from './constants';
import { environmentDefault, serverUrl } from './constants';

export const environment: IEnvironment = {
  ...environmentDefault,
  development: false,
  production: true,
  END_POINT: '#{API_URL}#',
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,
  adobe: '#{ADOBE_URL}',
  hotjarSiteId: '#{HOTJAR_SITE_ID}',
  hotjarVersion: '#{HOTJAR_VERSION}',
};
