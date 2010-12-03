goog.provide('dots.Canvas');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');
goog.require('goog.graphics.SvgGraphics');
goog.require('goog.math.Coordinate');
goog.require('goog.ui.Component');
goog.require('goog.graphics.SolidFill');
goog.require('goog.graphics.AffineTransform');

/**
 * @constructor
 */
dots.Canvas = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
  
  this.zoom_ = 100;
  this.graphics_ = undefined;
  this.redFill_ = new goog.graphics.SolidFill('#CC2222', 1);
  this.greenFill_ = new goog.graphics.SolidFill('#22CC22', 1);
  this.dots_ = { };
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
  this.graphics_ = new goog.graphics.SvgGraphics(size.width, size.height);
  this.tx_ = new goog.graphics.AffineTransform();
  
  this.graphics_.createDom();
  this.tx_.scale(this.zoom_, -this.zoom_);
  this.tx_.translate(0, -this.zoom_ * size.height);
  
  this.graphics_.getCanvasElement().getElement().setAttribute('transform', 'matrix(' + 
    this.tx_.m00_ +', ' +
    this.tx_.m10_ +', ' +
    this.tx_.m01_ +', ' +
    this.tx_.m11_ +', ' +
    this.tx_.m02_ +', ' +
    this.tx_.m12_ +
  ')');
  
  this.addChild(this.graphics_, false);
  this.graphics_.render(this.getElement());
};

/**
 * @private
 */
dots.Canvas.prototype.addListeners_ = function() {
  goog.events.listen(this.getElement(), goog.events.EventType.MOUSEDOWN, this.mouseDown_, false, this);
  goog.events.listen(this.getElement(), goog.events.EventType.MOUSEOVER, this.mouseOver_, false, this);
  goog.events.listen(this.getElement(), goog.events.EventType.MOUSEOUT, this.mouseOut_, false, this);
};

/**
 * @private
 */
dots.Canvas.prototype.mouseDown_ = function(event) {
  var mouseDown = this.transform_(event.offsetX, event.offsetY);
  var dot = this.createDot_(mouseDown.x, mouseDown.y);
  
  event.stopPropagation();
  event.preventDefault();
};

/**
 * @private
 */
dots.Canvas.prototype.transform_ = function(x, y) {
  var tx = this.tx_.createInverse();
  var points = [x, y];
  
  tx.transform(points, 0, points, 2, 1);
  
  return new goog.math.Coordinate(points[2], points[3]);
};

/**
 * @private
 */
dots.Canvas.prototype.createDot_ = function(x, y) {
  var result = this.graphics_.drawEllipse(x, y, 0.1, 0.1, null, this.redFill_);
  var element = result.getElement();
  this.dots_[goog.getUid(element)] = result;
  
  return result;
};

/**
 * @private
 */
dots.Canvas.prototype.mouseOver_ = function(event) {
  var dot = this.dots_[goog.getUid(event.target)];
  
  if (dot) {
    dot.setFill(this.greenFill_);
  } else {
    
  }
};

/**
 * @private
 */
dots.Canvas.prototype.mouseOut_ = function(event) {
  var dot = this.dots_[goog.getUid(event.target)];
  
  if (dot) {
    dot.setFill(this.redFill_);
  } else {
    
  }
};
