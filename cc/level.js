goog.provide('cc.Level');

goog.require('lime.Circle');
goog.require('lime.Sprite');

goog.require('cc');
goog.require('cc.ActionPlan');
goog.require('cc.Message');
goog.require('cc.Robot');
goog.require('cc.Toolbox');
goog.require('cc.World');

DIRECTIONS = ["Move the robot through the cavern entrance on the right.", "Instructions for this level"];

cc.Level = function(levelNum) {
  goog.base(this);

  this.levelNum = levelNum;
  this.setUp();

  var directions = DIRECTIONS[levelNum-1] || "Directions";
  this.message = new cc.Message("Level " + levelNum + ": " + directions);
  this.message.setPosition(200, 100);
  this.appendChild(this.message);
  //TODO: make message text wrap
  //TODO: disable rest of level while message is shown

  var self = this;
  var helpButton = new lime.GlossyButton('Help').setSize(60, 30).setAnchorPoint(0,0).setPosition(40, 20).setColor('#77d');
  goog.events.listen(helpButton, 'click', function() {
      self.message.show();
  });
  this.appendChild(helpButton);
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
  this.world.setChildIndex(this.robot,1);

  this.setAnchorPoint(0,0);
  this.toolbox = new cc.Toolbox().setPosition(0,500);
  this.appendChild(this.toolbox);

  this.setAnchorPoint(0,0);
  this.actionPlan = new cc.ActionPlan().setPosition(800,0);
  this.appendChild(this.actionPlan);
};