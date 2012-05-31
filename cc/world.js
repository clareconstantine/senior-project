goog.provide('cc.World');

cc.World = function(world_num) {
	goog.base(this);


	this.setFill('#ccf');
  this.setAnchorPoint(0,0);
  this.setSize(cc.World.WIDTH, cc.World.HEIGHT);
};
goog.inherits(cc.World, lime.Sprite);

cc.World.HEIGHT = 500;
cc.World.WIDTH = 800;