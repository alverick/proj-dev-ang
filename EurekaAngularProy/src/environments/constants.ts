import { NgxLoggerLevel } from 'ngx-logger';

export const serverUrl = {
  local: 'https://localhost:5001/api',
  dev: 'https://apis.dev.interbank.pe/eureca/api',
  uat: 'https://apis.uat.interbank.pe/eureca/api',
  prod: 'https://apis.interbank.pe/eureca/api',
};

export interface IEnvironment {
  production: boolean;
  development: boolean;
  hmr: boolean;
  END_POINT: string;
  OCP_KEY: string;
  logLevel: number;
  serverLogLevel: number;
  credentials: string[][];
  adobe: string;
}

export const environmentDefault: IEnvironment = {
  production: false,
  development: true,
  hmr: false,
  END_POINT: serverUrl.local,
  OCP_KEY: '',
  adobe: '',
  logLevel: NgxLoggerLevel.WARN,
  serverLogLevel: NgxLoggerLevel.OFF,
  credentials: [['', '', '']],
};
