goog.provide('cc.Robot');

cc.Robot = function() {
  goog.base(this);

  this.BODY_COLOR = '#444';
  this.BODY_WIDTH = 75;
  this.BODY_HEIGHT = 125;
  this.PARTS_COLOR = '#000';
  this.EYE_SIZE = 8;
  this.EYE_Y = 30;
  this.MOUTH_WIDTH = 60;
  this.MOUTH_HEIGHT = 5;
  this.MOUTH_Y = 50;
  this.MOUTH_X = 38;

  this.setFill(this.BODY_COLOR);
  this.setSize(this.BODY_WIDTH,this.BODY_HEIGHT);
  this.setAnchorPoint(0,0);
  
  var eye1 = new lime.Sprite().setFill(this.PARTS_COLOR).setSize(this.EYE_SIZE,this.EYE_SIZE),
    eye2 = new lime.Sprite().setFill(this.PARTS_COLOR).setSize(this.EYE_SIZE,this.EYE_SIZE);
  eye1.setPosition(10,this.EYE_Y);
  eye2.setPosition(65,this.EYE_Y);
  this.appendChild(eye1).appendChild(eye2);
  
  var mouth = new lime.Sprite().setFill(this.PARTS_COLOR).setSize(
      this.MOUTH_WIDTH,this.MOUTH_HEIGHT).setPosition(this.MOUTH_X,this.MOUTH_Y);
  this.appendChild(mouth);

  var self = this;
  amplify.subscribe("MoveRobot", function(dx, dy) {
    self.move(dx,dy);
  });
};
goog.inherits(cc.Robot, lime.Sprite);

cc.Robot.prototype.move = function(dx, dy) {
  this.setPosition(this.getPosition().x + dx, this.getPosition().y + dy);
};
