const R = require('ramda');
const settings = {
  default: {
    newRelic: '',
    hotjar: '',
  },
  dev: {
    newRelic: 'assets/scripts/new-relic-dev.js',
    hotjar: '',
  },
  uat: {
    newRelic: 'assets/scripts/new-relic-dev.js',
    hotjar: 'assets/scripts/hotjar.js',
  },
  production: {
    newRelic: 'assets/scripts/new-relic.js',
    hotjar: 'assets/scripts/hotjar.js',
  },
};

function includeScripts(configuration, indexHtml) {
  let scripts = '';
  R.forEachObjIndexed(function (value) {
    if (!R.isEmpty(value)) {
      scripts += `<script src="${value}"></script>`;
    }
  }, settings[configuration]);
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
  return includeScripts(
    sameAsDefault.includes(configuration) ? 'default' : configuration,
    indexHtml
  );
};
