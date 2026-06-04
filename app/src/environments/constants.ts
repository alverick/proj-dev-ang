import { NgxLoggerLevel } from 'ngx-logger';

export const serverUrl = {
  local: 'https://localhost:5001/api',
  dev: 'https://apis.dev.interbank.pe/eureca/api',
  uat: 'https://apis.uat.interbank.pe/eureca/api',
  prod: 'https://apis.interbank.pe/eureca/api',
};
export const Recaptcha = {
  dev: '6Ldocp4rAAAAAE26XlG3fIe2b_0hBhE3LrLRXGJn',
  hmr: '6Ldocp4rAAAAAE26XlG3fIe2b_0hBhE3LrLRXGJn',
  legacyProd: '6LcLkqsrAAAAAGecQmU5cy0JCRr484i5Np6cIGpC',
  uat: '6Ldpcp4rAAAAAErayT0V1vXFOih8hbzr5ZltvUP_',
} as const;

/**
 * Defines the environment configuration settings for the application.
 */
export type IEnvironment = {
  /**
   * Indicates if the application is running in production mode.
   * When `true`, optimizations such as minification and AOT compilation are enabled.
   * @example true // Production mode enabled
   */
  production: boolean;

  /**
   * Indicates if the application is running in development mode.
   * When `true`, debugging tools and detailed logs may be enabled.
   * @example true // Development mode enabled
   */
  development: boolean;

  /**
   * Enables Hot Module Replacement (HMR) for live updates without a full reload.
   * Used primarily in development mode.
   * @example true // HMR enabled
   */
  hmr: boolean;

  /**
   * The base API endpoint URL for the application's backend services.
   * @example "https://api.example.com/v1"
   */
  END_POINT: string;

  /**
   * The OCP (Optional Custom Parameter) key used for API authentication.
   * Typically required for accessing secure endpoints.
   * @example "12345-abcde-67890-fghij"
   */
  OCP_KEY: string;

  /**
   * Defines the logging level for client-side logs.
   * Uses `NgxLoggerLevel` from `ngx-logger` to specify log verbosity.
   *
   * Possible values:
   * - `NgxLoggerLevel.TRACE` (0)
   * - `NgxLoggerLevel.DEBUG` (1)
   * - `NgxLoggerLevel.INFO` (2)
   * - `NgxLoggerLevel.LOG` (3)
   * - `NgxLoggerLevel.WARN` (4)
   * - `NgxLoggerLevel.ERROR` (5)
   * - `NgxLoggerLevel.FATAL` (6)
   * - `NgxLoggerLevel.OFF` (7)
   *
   * @example NgxLoggerLevel.DEBUG // Logs debugging messages
   */
  logLevel: NgxLoggerLevel;

  /**
   * Defines the logging level for server-side logs.
   * Similar to `logLevel`, but applies to backend logging.
   * Uses `NgxLoggerLevel` for setting verbosity.
   *
   * @example NgxLoggerLevel.ERROR // Logs only errors on the server
   */
  serverLogLevel: NgxLoggerLevel;

  /**
   * A list of credential containing:
   * - **ruc**  The login username.
   * - **password** : The associated password.
   * - **comment** : A description or metadata about the credential.
   *
   * @example
   * [
   *   ["adminUser", "securePass123", "Administrator Account"],
   *   ["devUser", "devPass456", "Development Environment Credentials"]
   * ]
   *
   * Used primarily in development mode.
   */
  credentials: [username: string, password: string, comment?: string][];

  /**
   * Adobe integration key or configuration value.
   * Used for Adobe services, such as analytics or authentication.
   * @example "adobe-client-id-12345"
   */
  adobe: string;
  recaptcha: (typeof Recaptcha)[keyof typeof Recaptcha] | null;
  dynatrace: string;
  hotjarSiteId: string;
  hotjarVersion: string;
};

export const environmentDefault: IEnvironment = {
  production: false,
  development: true,
  hmr: false,
  END_POINT: serverUrl.local,
  OCP_KEY: '',
  adobe: '',
  recaptcha: null,
  dynatrace: '',
  logLevel: NgxLoggerLevel.WARN,
  serverLogLevel: NgxLoggerLevel.OFF,
  credentials: [['', '', '']],
  hotjarSiteId: null,
  hotjarVersion: null,
};
