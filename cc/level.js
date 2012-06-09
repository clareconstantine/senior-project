goog.provide('cc.Level');

goog.require('lime.Circle');
goog.require('lime.Sprite');

goog.require('cc.ActionPlan');
goog.require('cc.Message');
goog.require('cc.Robot');
goog.require('cc.Toolbox');
goog.require('cc.World');

DIRECTIONS = ["Move the robot through the cavern entrance on the right.",
              "Collect the coin on your way through the tunnel.",
              "Collect all the coins on your way through the tunnel."];
PASSWORDS = ["one", "two", "three", "four"];

cc.Level = function(levelNum, robot, actionPlan) {
  goog.base(this);

  this.levelNum = levelNum;
  this.robot = robot;
  this.actionPlan = actionPlan;
  this.setUp();

  this.directions = DIRECTIONS[levelNum-1] || "";
  this.password = PASSWORDS[levelNum-1] || '';
  this.message = new cc.Message();
  this.message.setPosition(200, 100).setHidden(true);
  this.appendChild(this.message);
  //TODO: disable rest of level while message is shown

  var self = this;
  var helpButton = new lime.GlossyButton('Help').setSize(60, 30).setAnchorPoint(0,0).setPosition(40, 20).setColor('#77d');
  goog.events.listen(helpButton, 'click', function() {
      self.message.show(self.directions, "MISSION");
  });
  this.appendChild(helpButton);

  var solutionButton = new lime.GlossyButton('See Mission').setSize(120, 30).setAnchorPoint(0,0).setPosition(140, 20).setColor('#77d');
  goog.events.listen(solutionButton, 'click', function() {
      self.animateSolution(self.levelNum);
  });
  this.appendChild(solutionButton);
  
  this.dsub = amplify.subscribe("ShowDescription", function(msg, toolName){ 
    self.message.show(msg, toolName);
  });

  this.hsub = amplify.subscribe("MessageHidden", function(){
    self.reset();
  });
  amplify.unsubscribe("MessageHidden", this.hsub);

};
goog.inherits(cc.Level,lime.Sprite);

cc.Level.WIDTH = cc.World.WIDTH + cc.ActionPlan.WIDTH;
cc.Level.HEIGHT = cc.World.HEIGHT + cc.Toolbox.HEIGHT;

//// Do set up for specific levelNum
cc.Level.prototype.setUp = function() {
  this.attempts = 0;

  var self = this;

  this.setAnchorPoint(0,0);
  this.world = new cc.World(this.levelNum);
  this.appendChild(this.world);
  
  this.robot.setPosition(10,350);
  this.world.appendChild(this.robot);
  this.world.setChildIndex(this.robot,1);

  this.setAnchorPoint(0,0);
  this.toolbox = new cc.Toolbox(this.levelNum, this.actionPlan, this).setPosition(0,500);
  this.appendChild(this.toolbox);

  lime.scheduleManager.schedule(function (dt) {
    self.checkCollisions();
  });
  this.sub = amplify.subscribe("LevelAttempted", function() {
    self.levelAttempted(self.levelNum);
  });
};

cc.Level.prototype.levelAttempted = function(levelNum) {
  var msg = "";
  var notFarEnough = "Make sure you send the robot all the way to the next cavern!";
  switch (levelNum) {
    case 1:
      if (this.robotExitedDoor()) {
        return this.levelPassed();
      } else {
        msg = notFarEnough;
      }
      break;
    case 2:
      if (this.world.collidersGrabbed() && this.robotExitedDoor()) {
        return this.levelPassed();
      } else if (!this.world.collidersGrabbed()) {
        msg = "Jump up and grab the coin on the way!";
      } else {
        msg = notFarEnough;
      }
      break;
    case 3:
      if (this.robotExitedDoor()) {
        if (this.world.collidersGrabbed()) {
          if (this.actionPlan.usesForTool()) {
            return this.levelPassed();
          } else {
            msg = "That's a long program! Try using the Times tool. It lets you \
                tell the robot to do things multiple times in a row.";
          }
        } else {
          msg = "Make sure you grab all the coins!";
        }
      } else {
        msg = notFarEnough;
      }
    default:
      break;
  }
  this.levelFailed(msg);
};

cc.Level.prototype.robotExitedDoor = function() {
  return this.robot.getPosition().x > this.world.doorX;
};

cc.Level.prototype.levelFailed = function(msg) {
  this.message.show(msg || "", "Try again.");
  /// this.attempts++; // make hint available for attempts>1, only show by default after first
  var self = this;
  goog.events.listen(this.message.okButton, 'click', function() {
    self.reset();
  });
};

cc.Level.prototype.levelPassed = function() {
  // TODO: show congrats message, tell them password & move to next level (like start page)
  amplify.publish("LevelPassed", this);
  amplify.unsubscribe("LevelAttempted", this.sub);
};

cc.Level.prototype.reset = function() {
  this.robot.setPosition(10,350);
  this.world.reset();
};

cc.Level.prototype.checkCollisions = function() {
  if (this.world && this.world.colliders) {
    for (var i=0; i<this.world.colliders.length; i++) {
      var col = this.world.colliders[i];
      if (goog.math.Box.intersects(this.robot.getBoundingBox(), col.getBoundingBox())) {
        if (col.robotCollided) {
          col.robotCollided();
        }
      }
    }
  }
};

cc.Level.prototype.animateSolution = function(levelNum) {
  var animations = [];
  var moveTool = new cc.Tool("MOVE");
  var jumpTool = new cc.Tool("JUMP");
  switch (levelNum) {
    case 1:
      // screen is 8 positions wide, must move robot 8 times (off the screen) to complete level
      for (var i=0; i<8; i++) {
        animations.push(moveTool.getAnimation());
      }
      break;
    case 2:
      for (var i=0; i<4; i++) {
        animations.push(moveTool.getAnimation());
      }
      animations.push(jumpTool.getAnimation());
      for (var i=0; i<4; i++) {
        animations.push(moveTool.getAnimation());
      }
      break;
    case 3:
      for (var i=0; i<8; i++) {
        animations.push(moveTool.getAnimation());
        if (i==0 || i==2 || i==4 || i==6) {
          animations.push(jumpTool.getAnimation());
        }
      }
    default:
  }
  var sequence = new lime.animation.Sequence(animations);
  amplify.publish("RunSequence", sequence);
  var self = this;
  goog.events.listen(sequence,lime.animation.Event.STOP,function(){
    self.reset();
  })
}