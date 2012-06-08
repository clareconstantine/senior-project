goog.provide('cc.Coin');

goog.require('lime.Circle');

cc.Coin = function() {
  goog.base(this);
  this.setSize(30,30).setFill('#FFC125').setAnchorPoint(0,0);
  this.wasGrabbed = false;
};
goog.inherits(cc.Coin, lime.Circle);


cc.Coin.prototype.robotCollided = function() {
  this.setHidden(true);
  this.wasGrabbed = true;
};