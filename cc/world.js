goog.provide('cc.World');

cc.World = function(world_num) {
	lime.Sprite.call(this);

	this.setFill('#ccf');
	this.setSize(600,500);
};
goog.inherits(cc.World, lime.Sprite);