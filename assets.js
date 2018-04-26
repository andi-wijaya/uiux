function NDDOM(selector, parent){

  this.selector = typeof selector == 'undefined' ? '._$' : selector;
  this.parent = typeof parent == 'undefined' ? null : parent;

}

NDDOM.prototype.html = function(html){

  this.each(function(){
    this.innerHTML = html;
  });

}
NDDOM.prototype.css = function(css){

  this.each(function(){
    for(var key in css){
      this.style[key] = css[key];
    }
  });

}
NDDOM.prototype.addClass = function(className){

  this.each(function(){
    this.classList.add(className);
  });

}
NDDOM.prototype.each = function(callback){

  if(typeof callback == 'undefined' || typeof callback != 'function') return;
  if(this.selector instanceof HTMLElement){
    callback.call(this.selector);
  }
  else{

    var cont = this.parent instanceof HTMLElement ? this.parent : document;
    if((_nl = cont.querySelectorAll(this.selector)).length > 0){
      for(var i = 0 ; i < _nl.length ; i++){
        callback.call(_nl[i]);
      }
    }

  }


}
NDDOM._namespaces = [];
NDDOM.r = function(name){
  NDDOM._namespaces.push(name);
}
NDDOM.start = function(){

  if(typeof app == 'object' && typeof app.render == 'function') app.render();

  for(var i = 0 ; i < NDDOM._namespaces.length ; i++){
    var namespace = NDDOM._namespaces[i];
    $("." + namespace).each(function(){
      if(typeof $(this)[namespace] != 'undefined' && typeof $(this)[namespace] == 'function') $(this)[namespace]();
    })
  }

  $('#page').addClass('on');

}
NDDOM.is_in_viewport = function(el){

  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    (top + height) <= (window.pageYOffset + window.innerHeight) &&
    (left + width) <= (window.pageXOffset + window.innerWidth)
  );

}

function $(selector, parent){ return new NDDOM(selector, parent); }

window.addEventListener('load', NDDOM.start);

NDDOM._namespaces.push('searchbar');
NDDOM.prototype.searchbar = function(){

  this.each(function(){

    $(this).html("<span class='fa fa-search'></span><input />");
    $(this).addClass('rendered');

  })

}

NDDOM._namespaces.push('section');
NDDOM.prototype.section = function(){

  this.each(function(){

    $('.header')

  })

}
