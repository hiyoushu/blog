var mapToArr = require('./map-to-arr');

module.exports = function(posts) {
  var arcArray = [],
      archives = [],
      _archives = {};

  posts.forEach(function(item, index, arr) {
    var _tempYear = item.createTime.getFullYear(),
        _tempMonth = item.createTime.getMonth() + 1;

    if (arcArray.indexOf(_tempYear) != -1) {
      if (_archives[_tempYear].get(_tempMonth)) {
        _archives[_tempYear].set(_tempMonth, _archives[_tempYear].get(_tempMonth) + 1);
      } else {
        _archives[_tempYear].set(_tempMonth, 1);
      }
    } else {
      arcArray.push(_tempYear);
      _archives[_tempYear] = new Map();
      _archives[_tempYear].set(_tempMonth, 1);
    }
  });

  arcArray.forEach(function(item, index, arr) {
      archives.push({
        year: item,
        months: mapToArr(_archives[item])
      });
  });
  arcArray = null;

  return archives;
}
