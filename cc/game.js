goog.provide('cc.Game');

goog.require('lime.Circle');
goog.require('lime.Sprite');

goog.require('cc.Robot');
goog.require('cc.World');

cc.Game = function(mode) {
  goog.base(this);

  this.WIDTH = 800;
  this.HEIGHT = 500;

  this.setAnchorPoint(0,0);
  this.world = new cc.World(0).setSize(this.WIDTH,this.HEIGHT);
  this.appendChild(this.world);
  
  this.robot = new cc.Robot().setPosition(10,350);
  this.world.appendChild(this.robot);
};
goog.inherits(cc.Game,lime.Sprite);

cc.Game.WIDTH = 800;
cc.Game.HEIGHT = 500;