goog.provide('cc.World');

goog.require('cc.Coin');
goog.require('lime.Circle');
goog.require('lime.Polygon');

cc.World = function(levelNum) {
	goog.base(this);

  this.setAnchorPoint(0,0);
  this.setSize(cc.World.WIDTH, cc.World.HEIGHT);
  var label = new lime.Label("Level " + levelNum).setPosition(750, 20);
  this.appendChild(label);

  this.colliders = [];
  this.doorX = 800; // By default, robot has to pass right edge to exit. 

  this.setAnchorPoint(0,0);
  this.setUpWorld(levelNum);
};
goog.inherits(cc.World, lime.Sprite);

cc.World.HEIGHT = 500;
cc.World.WIDTH = 800;

cc.World.prototype.reset = function() {
  for (var i=0; i<this.colliders.length; i++) {
    this.colliders[i].setHidden(false);
  }
};

cc.World.prototype.numColliders = function() {
  return this.colliders.length;
};

cc.World.prototype.collidersGrabbed = function() {
  var count = 0;
  for (var i=0; i<this.numColliders(); i++) {
    if (this.colliders[i].wasGrabbed) count++;
  }
  return count;
};

cc.World.prototype.setUpWorld = function(level) {

  var self = this;
  var groundColor1 = '#222';
  var groundColor2 = '#575';
  var backgroundColor = '#ccf';
  switch (level) {
    case 1:
      this.door = new lime.Polygon().setFill('#663422');
      this.door.addPoints(560,500, 600,350, 700,275, 800,250, 800,500);
      this.doorX = 600;
      this.appendChild(this.door);
      break;
    case 2:
      groundColor2 = '#555';
      backgroundColor = '#88a';

      this.door = new lime.Sprite().setFill('#000').setSize(100, 150).setAnchorPoint(1,1).setPosition(800,500);
      this.appendChild(this.door);
      this.doorX = 700;

      this.coin = new cc.Coin();
      this.placeChild(this.coin, 4, 3);
      this.setChildIndex(this.coin, 0);
      this.colliders.push(this.coin);

      break;

    case 3:
      groundColor2 = '#777';
      backgroundColor = '#c8a';
      for (var i=1; i<8; i+=2) {
        var coin = new cc.Coin();
        this.appendChild(coin);
        this.placeChild(coin, i, 3);
        this.setChildIndex(coin, 0);
        this.colliders.push(coin);
      }

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

cc.World.prototype.collidersCollected = function() {
  var count = 0;
  for (var i=0; i<this.numColliders(); i++) {
    if (this.colliders[i].wasGrabbed) count++;
  }
  return count;
};

// Append the child at x,y of our world grid
cc.World.prototype.placeChild = function(child, x, y) {
  var xPos = 50 + 100*x;
  var yPos = 100*y;
  child.setPosition(xPos,yPos);
  this.appendChild(child);
};