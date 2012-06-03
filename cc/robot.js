goog.provide('cc.Robot');

goog.require('lime.animation.MoveBy');

cc.Robot = function() {
  goog.base(this);

  this.BODY_COLOR = '#444';
  this.BODY_WIDTH = 80;
  this.BODY_HEIGHT = 125;
  this.PARTS_COLOR = '#000';
  this.EYE_SIZE = 8;
  this.EYE_Y = 30;
  this.MOUTH_WIDTH = 60;
  this.MOUTH_HEIGHT = 5;
  this.MOUTH_Y = 50;
  this.MOUTH_X = 10;

  this.setFill(this.BODY_COLOR);
  this.setSize(this.BODY_WIDTH,this.BODY_HEIGHT);
  this.setAnchorPoint(0,0);
  
  var eye1 = new lime.Sprite().setFill(this.PARTS_COLOR).setSize(this.EYE_SIZE,this.EYE_SIZE),
    eye2 = new lime.Sprite().setFill(this.PARTS_COLOR).setSize(this.EYE_SIZE,this.EYE_SIZE);
  eye1.setPosition(15,this.EYE_Y);
  eye2.setPosition(65,this.EYE_Y);
  this.appendChild(eye1).appendChild(eye2);
  
  var mouth = new lime.Sprite().setFill(this.PARTS_COLOR).setSize(
      this.MOUTH_WIDTH,this.MOUTH_HEIGHT).setAnchorPoint(0,0).setPosition(this.MOUTH_X,this.MOUTH_Y);
  this.appendChild(mouth);

  var self = this;
  amplify.subscribe("RunSequence", function(sequence) {
    self.runAction(sequence);
  });
};
goog.inherits(cc.Robot, lime.Sprite);

cc.Robot.prototype.move = function(dx, dy) {
  var animation = new lime.animation.MoveBy(dx, dy);
  return animation;
};
