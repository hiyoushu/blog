var fs = require('fs');

module.exports = function(path, mode, cb) {
  var pathArr = path.split('/'),
      mode = mode || 0755,
      cb = cb || function() {},
      _arr = [],
      _temp = '';

  if (pathArr[pathArr.length - 1] === '') {
    pathArr.pop();
  }

  pathArr.forEach(function(value, index, arr) {
    if (/\.|\.\./g.test(value)) {
      _temp += (value + '/');
    } else {
      if (_temp === '') {
        _arr.push(value);
      } else {
        _arr.push(_temp + value);
        _temp = '';
      }
    }
  });

  _temp = '';
  _arr.forEach(function(value, index, arr) {
    _temp += (value + '/');
    if (!fs.existsSync(_temp)) {
      fs.mkdirSync(_temp, mode);
    }
  });

  cb();
}
