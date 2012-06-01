goog.provide('cc.World');

goog.require('lime.Polygon');

cc.World = function(levelNum) {
	goog.base(this);

	this.setFill('#ccf');
  this.setAnchorPoint(0,0);
  this.setSize(cc.World.WIDTH, cc.World.HEIGHT);
  var label = new lime.Label("Level " + levelNum).setPosition(750, 20);
  this.appendChild(label);

  // Represents world
  this.grid = new Array(8);
  for (var i=0; i<8; i++) {
    this.grid[i] = new Array(8);
  }

  var ground = new lime.Sprite().setSize(800,20).setFill('#222').setAnchorPoint(0,0).setPosition(0,480);
  
  this.appendChild(ground);
  for (var i=1; i<8; i+=2) {
    var brick = new lime.Sprite().setSize(100,20).setFill('#575');
    brick.setAnchorPoint(0,0).setPosition(0+i*100,1);
    ground.appendChild(brick);
  }

  this.setAnchorPoint(0,0);
  this.setUpWorld(levelNum);
};
goog.inherits(cc.World, lime.Sprite);

cc.World.HEIGHT = 500;
cc.World.WIDTH = 800;

cc.World.prototype.setUpWorld = function(level) {
  switch (level) {
    case 1:
      this.door = new lime.Polygon().setFill('#663422');
      this.door.addPoints(650,500, 700,350, 800,300, 800,500);
      this.appendChild(this.door);
      break;
    default:
      break;
  }
};