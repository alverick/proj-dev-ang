module.exports = ({ configuration }, indexHtml) => {
  const environmentAllowed = ['production', 'uat'];
  if (environmentAllowed.includes(configuration)) {
    const enHeadPosition = indexHtml.indexOf('</head>');
    const scriptHotjar = '<script src="assets/scripts/hotjar.js"></script>';
    return `${indexHtml.slice(0, enHeadPosition)}
            ${scriptHotjar}
            ${indexHtml.slice(enHeadPosition)}`;
  }
  return indexHtml;
};
