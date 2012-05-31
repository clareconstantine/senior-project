goog.provide('cc.World');

cc.World = function(levelNum) {
	goog.base(this);

  // set up world for levelNum

	this.setFill('#ccf');
  this.setAnchorPoint(0,0);
  this.setSize(cc.World.WIDTH, cc.World.HEIGHT);
  var label = new lime.Label("Level " + levelNum).setPosition(750, 20);
  this.appendChild(label);
};
goog.inherits(cc.World, lime.Sprite);

cc.World.HEIGHT = 500;
cc.World.WIDTH = 800;