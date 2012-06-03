goog.provide('cc.World');

goog.require('lime.Circle');
goog.require('lime.Polygon');

cc.World = function(levelNum) {
	goog.base(this);

  this.setAnchorPoint(0,0);
  this.setSize(cc.World.WIDTH, cc.World.HEIGHT);
  var label = new lime.Label("Level " + levelNum).setPosition(750, 20);
  this.appendChild(label);

  // Represents world
  this.grid = new Array(8);
  for (var i=0; i<8; i++) {
    this.grid[i] = new Array(8);
  }

  this.setAnchorPoint(0,0);
  this.setUpWorld(levelNum);
};
goog.inherits(cc.World, lime.Sprite);

cc.World.HEIGHT = 500;
cc.World.WIDTH = 800;

cc.World.prototype.setUpWorld = function(level) {

  var groundColor1 = '#222';
  var groundColor2 = '#575';
  var backgroundColor = '#ccf';
  switch (level) {
    case 1:
      this.door = new lime.Polygon().setFill('#663422');
      this.door.addPoints(650,500, 700,350, 800,300, 800,500);
      this.appendChild(this.door);
      break;
    case 2:
      groundColor2 = '#555';
      backgroundColor = '#88a';

      this.coin = new lime.Circle().setSize(30,30).setFill('#FFC125');
      this.placeChild(this.coin, 4, 3);
      this.setChildIndex(this.coin, 0);

      this.coin.wasCollected = false;
      //goog.events

      break;
    default:
      break;
  }


  this.setFill(backgroundColor);
  var ground = new lime.Sprite().setSize(800,20).setFill(groundColor1).setAnchorPoint(0,0).setPosition(0,480);
  this.appendChild(ground);
  for (var i=1; i<8; i+=2) {
    var brick = new lime.Sprite().setSize(100,20).setFill(groundColor2);
    brick.setAnchorPoint(0,0).setPosition(0+i*100,1);
    ground.appendChild(brick);
  }
};

// Append the child at x,y of our world grid
cc.World.prototype.placeChild = function(child, x, y) {
  var xPos = 50 + 100*x;
  var yPos = 100*y;
  child.setPosition(xPos,yPos);
  this.appendChild(child);
};