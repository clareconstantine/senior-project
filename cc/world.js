goog.provide('cc.World');

cc.World = function(levelNum) {
	goog.base(this);

	this.setFill('#ccf');
  this.setAnchorPoint(0,0);
  this.setSize(cc.World.WIDTH, cc.World.HEIGHT);
  var label = new lime.Label("Level " + levelNum).setPosition(750, 20);
  this.appendChild(label);

  this.setUpWorld(levelNum);
};
goog.inherits(cc.World, lime.Sprite);

cc.World.HEIGHT = 500;
cc.World.WIDTH = 800;

cc.World.prototype.setUpWorld = function(level) {
  switch (level) {
    case 1:
      var door = new lime.Sprite().setFill('#a44').setSize(15,200).setAnchorPoint(1,1).setPosition(cc.World.WIDTH,cc.World.HEIGHT);
      this.appendChild(door);
      break;
    default:
      break;
  }
};