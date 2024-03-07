import { type TargetOptions } from '@angular-builders/custom-webpack';
import { forEachObjIndexed, isEmpty } from 'ramda';

const defaultRootUrl = 'https://cobrosimple.dev.interbank.pe';

type EnvironmentType = 'default' | 'dev' | 'production' | 'uat';

type EnvironmentConfig = {
  scripts: { hotjar: string; newRelic: string };
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

function changeOgImage(configuration: EnvironmentType, indexHtml: string) {
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
  [includeScripts, changeOgImage].forEach((process) => {
    parsedHtml = process(
      (sameAsDefault.includes(configuration)
        ? 'default'
        : configuration) as EnvironmentType,
      isEmpty(parsedHtml) ? indexHtml : parsedHtml
    );
  });
  return parsedHtml;
};
