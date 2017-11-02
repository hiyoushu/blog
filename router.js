/**
 * dynamically loading router
 */

var fs = require('fs');

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
    this.app.use(routeFile, route);
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
