goog.provide('dots.Canvas');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.graphics');
goog.require('goog.ui.Component');
goog.require('goog.graphics.SolidFill');

/**
 * @constructor
 */
dots.Canvas = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
  
  this.graphics_ = undefined;
  this.fill_ = new goog.graphics.SolidFill('#aa4444', 1);
};

goog.inherits(dots.Canvas, goog.ui.Component);

/**
 * @inheritDoc
 */
dots.Canvas.prototype.enterDocument = function() {
  this.configureGraphics_();
  this.addListeners_();
};

/**
 * Overridden to provide 'canvas' class.
 *
 * @override
 */
dots.Canvas.prototype.createDom = function() {
  this.element_ = goog.dom.createDom('div', { 'class': 'canvas' });
};

/**
 * @private
 */
dots.Canvas.prototype.configureGraphics_ = function() {
  var size = goog.style.getSize(this.getElement());
  this.graphics_ = goog.graphics.createGraphics(size.width, size.height);
  
  this.addChild(this.graphics_, false);
  this.graphics_.render(this.getElement());
};

/**
 * @private
 */
dots.Canvas.prototype.addListeners_ = function() {
  goog.events.listen(this.getElement(), goog.events.EventType.MOUSEDOWN, this.mouseDown_, false, this);
};

/**
 * @private
 */
dots.Canvas.prototype.mouseDown_ = function(event) {
  this.graphics_.drawEllipse(event.clientX, event.clientY, 10, 10, null, this.fill_);
  
  // Removing the following lines doesn't affect the bug in Chrome.
  event.stopPropagation();
  event.preventDefault();
};
