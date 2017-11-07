module.exports = function(str, arr) {
  if (!str) {
    return false;
  }

  var match = false;

  arr.forEach(function(value, index, array) {
    var _tempRegex = new RegExp('^'+ value, 'g');
    if (_tempRegex.test(str)) {
      match = true;
      return true;
    }
  });

  if (match) {
    return true;
  }

  return false;
}
