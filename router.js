/**
 * dynamically loading router
 */

var fs = require('fs');
var ignoreI18nPath = require('./config').ignoreI18nPath;
var checkStrPartOfArr = require('./lib/check-str-part-of-arr');

var router = {
  path: './routes',
  app: null,
  loadDir: function(path){
    var fileList = fs.readdirSync(path, 'utf-8');
    var that = this;
    
    fileList.forEach(item => {
      if(fs.statSync(path + '/' + item).isDirectory()){
        that.loadDir(path + '/' + item);
      } else {
        that.loadRoute(path + '/' + item);
      }
    });
  },
  loadRoute: function(routeFile){
    var route = require(routeFile);
    routeFile = routeFile
                  .replace(this.path, '')
                  .replace('index.js', '')
                  .replace('.js', '');
    if (checkStrPartOfArr(routeFile, ignoreI18nPath)) {
      this.app.use(routeFile, route);
    } else {
      // handle i18n
      this.app.use('/:lang' + routeFile, function (req, res, next) {
        var lang = req.params.lang.toLowerCase();
        var currentLang = req.i18n.language;
        var languages = req.i18n.options.preload.map(function(elem) {
          return elem.toLowerCase();
        });

        if (lang != currentLang) {
          if (languages.indexOf(lang) > -1) {
            req.i18n.changeLanguage(lang);
          } else {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
          }
        }

        next();
      });

      this.app.use(routeFile, route);
      this.app.use('/:lang' + routeFile, route);
    }
  },
  init: function(app, path){
    if(!app){
      console.error('app is not set!');
      return false;
    }
    this.app = app;
    this.path = path ? path : this.path;
    this.loadDir(this.path);
  }
};


module.exports = router;
