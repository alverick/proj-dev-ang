module.exports = ({ configuration }, indexHtml) => {
  if (configuration.includes('production')) {
    const enHeadPosition = indexHtml.indexOf('</head>');
    const scriptHotjar = '<script src="assets/scripts/hotjar.js"></script>';
    return `${indexHtml.slice(0, enHeadPosition)}
            ${scriptHotjar}
            ${indexHtml.slice(enHeadPosition)}`;
  }
  return indexHtml;
};
