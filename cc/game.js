goog.provide('cc.Game');

goog.require('lime.Circle');
goog.require('lime.Sprite');

goog.require('cc.Robot');
goog.require('cc.World');

// NUM_LEVELS = 1;
// DEFAULT_WIDTH = 10;
// DEFAULT_HEIGHT = 10;

cc.Game = function(mode) {
  goog.base(this);

  //this.setSize(600, 800);
  //this.setFill("#ddddff");

  this.setAnchorPoint(0,0);
  this.world = new cc.World(0);
  this.appendChild(this.world);
  
  this.robot = new cc.Robot();
  this.world.appendChild(this.robot);
};
goog.inherits(cc.Game,lime.Sprite);