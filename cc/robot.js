goog.provide('cc.Robot');

cc.Robot = function() {
	lime.Sprite.call(this);

	this.setFill('#333');
	this.setSize(100,100);
	//this.setAnchorPoint(.5,1);
};
goog.inherits(cc.Robot, lime.Sprite);