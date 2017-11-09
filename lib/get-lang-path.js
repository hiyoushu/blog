module.exports = function(lang) {
  if (!lang) {
    return '';
  }

  var langPath = '';
  lang = lang.toLowerCase();

  if (lang != 'zh-cn' && lang != 'zh') {
    langPath = '/' + lang;
  }

  return langPath;
}
