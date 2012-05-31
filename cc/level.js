goog.provide('cc.Level');

goog.require('lime.Circle');
goog.require('lime.Sprite');

goog.require('cc');
goog.require('cc.ActionPlan');
goog.require('cc.Robot');
goog.require('cc.Toolbox');
goog.require('cc.World');


cc.Level = function(levelNum) {
  goog.base(this);

  //// Do set up for specific levelNum

  this.setAnchorPoint(0,0);
  this.world = new cc.World(0);
  this.appendChild(this.world);
  
  this.robot = new cc.Robot().setPosition(10,350);
  this.world.appendChild(this.robot);

  this.setAnchorPoint(0,0);
  this.toolbox = new cc.Toolbox().setPosition(0,500);
  this.appendChild(this.toolbox);

  this.setAnchorPoint(0,0);
  this.actionPlan = new cc.ActionPlan().setPosition(800,0);
  this.appendChild(this.actionPlan);
};
goog.inherits(cc.Level,lime.Sprite);

cc.Level.WIDTH = cc.World.WIDTH + cc.ActionPlan.WIDTH;
cc.Level.HEIGHT = cc.World.HEIGHT + cc.Toolbox.HEIGHT;