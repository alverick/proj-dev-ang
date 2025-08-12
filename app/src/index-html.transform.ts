import { type TargetOptions } from '@angular-builders/custom-webpack';
import { forEachObjIndexed, isEmpty } from 'ramda';

const defaultRootUrl = 'https://cobrosimple.dev.interbank.pe';

/**
 * Defines the possible environment types for the application.
 *
 * - `default` - The fallback environment configuration.
 * - `dev` - Development environment with debugging tools enabled.
 * - `production` - Production environment with optimizations.
 * - `uat` - User Acceptance Testing (UAT) environment for validation.
 */
type EnvironmentType =
  | 'default'
  | 'dev'
  | 'production'
  | 'legacy-production'
  | 'uat';

/**
 * Configuration settings for each environment.
 */
type EnvironmentConfig = {
  /**
   * The base domain URL for the environment.
   *
   * @example "https://cobrosimple.uat.interbank.pe"
   */
  url: string;
};

const settings: Record<EnvironmentType, EnvironmentConfig> = {
  default: {
    url: defaultRootUrl,
  },
  dev: {
    url: defaultRootUrl,
  },
  uat: {
    url: 'https://cobrosimple.uat.interbank.pe',
  },
  production: {
    url: 'https://cobrosimple.interbank.pe',
  },
  'legacy-production': {
    url: 'https://cobrosimple.interbank.pe',
  },
};

function replaceDomainUrl(configuration: EnvironmentType, indexHtml: string) {
  if (settings[configuration].url !== defaultRootUrl) {
    return indexHtml.replaceAll(defaultRootUrl, settings[configuration].url);
  }
  return indexHtml;
}

export default ({ configuration }: TargetOptions, indexHtml: string) => {
  const sameAsDefault = ['', 'hmr', 'local'];
  let parsedHtml = '';
  [replaceDomainUrl].forEach((process) => {
    parsedHtml = process(
      (sameAsDefault.includes(configuration)
        ? 'default'
        : configuration) as EnvironmentType,
      isEmpty(parsedHtml) ? indexHtml : parsedHtml,
    );
  });
  return parsedHtml;
};
