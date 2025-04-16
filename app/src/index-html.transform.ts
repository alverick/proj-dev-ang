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
type EnvironmentType = 'default' | 'dev' | 'production' | 'uat';

/**
 * Configuration settings for each environment.
 */
type EnvironmentConfig = {
  /**
   * Script file paths for third-party services.
   */
  scripts: {
    /**
     * The local path for the Hotjar tracking script.
     * Used for user behavior analytics.
     *
     * @example "/assets/scripts/hotjar.js"
     */
    hotjar: string;

    /**
     * The local path for the New Relic monitoring script.
     * Used for performance tracking and error logging.
     *
     * @example "/assets/scripts/newrelic.js"
     */
    newRelic: string;
  };

  /**
   * The base domain URL for the environment.
   *
   * @example "https://cobrosimple.uat.interbank.pe"
   */
  url: string;
};

const settings: Record<EnvironmentType, EnvironmentConfig> = {
  default: {
    scripts: {
      newRelic: '',
      hotjar: '',
    },
    url: defaultRootUrl,
  },
  dev: {
    scripts: {
      newRelic: 'assets/scripts/new-relic-dev.js',
      hotjar: '',
    },
    url: defaultRootUrl,
  },
  uat: {
    scripts: {
      newRelic: 'assets/scripts/new-relic-dev.js',
      hotjar: 'assets/scripts/hotjar.js',
    },
    url: 'https://cobrosimple.uat.interbank.pe',
  },
  production: {
    scripts: {
      newRelic: 'assets/scripts/new-relic.js',
      hotjar: 'assets/scripts/hotjar.js',
    },
    url: 'https://cobrosimple.interbank.pe',
  },
};

function replaceDomainUrl(configuration: EnvironmentType, indexHtml: string) {
  if (settings[configuration].url !== defaultRootUrl) {
    return indexHtml.replaceAll(defaultRootUrl, settings[configuration].url);
  }
  return indexHtml;
}

function includeScripts(configuration: EnvironmentType, indexHtml: string) {
  let scripts = '';
  forEachObjIndexed(function (value) {
    if (!isEmpty(value)) {
      scripts += `<script src="${value}"></script>`;
    }
  }, settings[configuration].scripts);
  if (!isEmpty(scripts)) {
    const enHeadPosition = indexHtml.indexOf('</head>');
    return `${indexHtml.slice(0, enHeadPosition)}
            ${scripts}
            ${indexHtml.slice(enHeadPosition)}`;
  }
  return indexHtml;
}

export default ({ configuration }: TargetOptions, indexHtml: string) => {
  const sameAsDefault = ['', 'hmr', 'local'];
  let parsedHtml = '';
  [includeScripts, replaceDomainUrl].forEach((process) => {
    parsedHtml = process(
      (sameAsDefault.includes(configuration)
        ? 'default'
        : configuration) as EnvironmentType,
      isEmpty(parsedHtml) ? indexHtml : parsedHtml,
    );
  });
  return parsedHtml;
};
