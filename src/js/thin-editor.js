// implement later

(function(global, thin){
  global.thinEditor = thin();
}(this, function(){
  var $ = document.querySelectorAll.bind(document);
  
  function Thin(selector) {
    var timeStamp = Date.now();
    var thinNode = $(selector);

    this.wrapper = thinNode[0];
    this.id = timeStamp;

    thinNode[0].innerHTML = '<div id="thin-id-'+ timeStamp +'" class="thin-editor-wrapper" data-id="'+ timeStamp +'"></div>';

    this.node = this.wrapper.childNodes[0]

    this.menu = document.createElement('div');
    this.menu.id = 'thin-editor-header';
    this.menu.className = 'thin-editor-header';

    this.content = document.createElement('div');
    this.content.id = 'thin-editor-content';
    this.content.className = 'thin-editor-content';
    this.content.setAttribute('contenteditable', true);

    this.node.appendChild(this.menu);
    this.node.appendChild(this.content);
  };

  Thin.prototype = {
    constructor: Thin,

    init: function() {

    },
  }

  return Thin;
}))