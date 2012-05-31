goog.provide('cc.Level');

goog.require('lime.Circle');
goog.require('lime.Sprite');

goog.require('cc');
goog.require('cc.ActionPlan');
goog.require('cc.Message');
goog.require('cc.Robot');
goog.require('cc.Toolbox');
goog.require('cc.World');

DIRECTIONS = ["Instructions for this level", "Instructions for this level"];

cc.Level = function(levelNum) {
  goog.base(this);

  this.levelNum = levelNum;
  this.setUp();

  var directions = DIRECTIONS[levelNum-1] || "Directions";
  this.message = new cc.Message("Level " + levelNum + ": " + directions);
  this.message.setPosition(200, 100);
  this.appendChild(this.message);

  var self = this;
  this.setAnchorPoint(0,0);
  var showInstructionsButton = new lime.GlossyButton('Help').setSize(100, 30).setPosition(730, 470).setColor('#77d');
  goog.events.listen(showInstructionsButton, 'click', function() {
      self.message.show();
  });
  this.appendChild(showInstructionsButton);
};
goog.inherits(cc.Level,lime.Sprite);

cc.Level.WIDTH = cc.World.WIDTH + cc.ActionPlan.WIDTH;
cc.Level.HEIGHT = cc.World.HEIGHT + cc.Toolbox.HEIGHT;


//// Do set up for specific levelNum
cc.Level.prototype.setUp = function() {
  this.setAnchorPoint(0,0);
  this.world = new cc.World(this.levelNum);
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