goog.provide('cc.World');

cc.World = function(world_num) {
	goog.base(this);

	this.setFill('#ccf');
  this.setAnchorPoint(0,0);
};
goog.inherits(cc.World, lime.Sprite);
