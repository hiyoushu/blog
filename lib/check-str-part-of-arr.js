module.exports = function(str, arr) {
  if (!str) {
    return false;
  }

  var match = false;

  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === '/') {
      // particular for '/'
      if (str === '/') {
        match = true;
        break;
      }
    } else {
      var _tempRegex = new RegExp('^'+ arr[i], 'g');
      if (_tempRegex.test(str)) {
        match = true;
        break;
      }
    }
  }

  if (match) {
    return true;
  }

  return false;
}
