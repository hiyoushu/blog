module.exports = function(lang) {
  if (!lang) {
    return '';
  }

  var langPath = '';

  if (lang != 'zh-cn' && lang != 'zh') {
    langPath = '/' + lang;
  }

  return langPath;
}
