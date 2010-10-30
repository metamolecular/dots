goog.provide('dots');

goog.require('goog.dom');
goog.require('dots.Canvas');

dots.init = function(opt_domHelper) {
  var canvas = new dots.Canvas();
  
  canvas.render();
};

