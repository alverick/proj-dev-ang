const R = require('ramda');
const defaultRootUrl = 'https://cobrosimple.dev.interbank.pe';
const settings = {
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

function changeOgImage(configuration, indexHtml) {
  if (settings[configuration].url !== defaultRootUrl) {
    return indexHtml.replaceAll(defaultRootUrl, settings[configuration].url);
  }
  return indexHtml;
}

function includeScripts(configuration, indexHtml) {
  let scripts = '';
  R.forEachObjIndexed(function (value) {
    if (!R.isEmpty(value)) {
      scripts += `<script src="${value}"></script>`;
    }
  }, settings[configuration].scripts);
  if (!R.isEmpty(scripts)) {
    const enHeadPosition = indexHtml.indexOf('</head>');
    return `${indexHtml.slice(0, enHeadPosition)}
            ${scripts}
            ${indexHtml.slice(enHeadPosition)}`;
  }
  return indexHtml;
}

module.exports = ({ configuration }, indexHtml) => {
  const sameAsDefault = ['', 'hmr', 'local'];
  let parsedHtml = '';
  [includeScripts, changeOgImage].forEach((process) => {
    parsedHtml = process(
      sameAsDefault.includes(configuration) ? 'default' : configuration,
      R.isEmpty(parsedHtml) ? indexHtml : parsedHtml
    );
  });
  return parsedHtml;
};
