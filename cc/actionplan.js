goog.provide('cc.ActionPlan');

goog.require('cc.World');
goog.require('cc.Toolbox');
goog.require('lime.animation.Sequence');

cc.ActionPlan = function() {
  goog.base(this);

  var self = this;

  this.actions = [];

  this.setAnchorPoint(0,0);
  this.setSize(cc.ActionPlan.WIDTH, cc.ActionPlan.HEIGHT);
  this.setFill('#000');

  this.scroll = new lime.Sprite();
  this.scroll.setSize(cc.ActionPlan.WIDTH, cc.World.HEIGHT-30).setAnchorPoint(0,0); // height reduced bc of clear button
  this.setAnchorPoint(0,0);
  var el = this.scroll.getDeepestDomElement();
  el.style.overflowY = "scroll";
  this.appendChild(this.scroll);

  this.runButton = new lime.GlossyButton("RUN").setSize(100,50);
  this.runButton.setAnchorPoint(0,0).setColor("#678").setPosition(75,550);
  goog.events.listen(this.runButton, ['click'], function(e) {
    self.run();
  });
  this.appendChild(this.runButton);

  this.planLabel = new lime.Label("COMMANDS").setFontSize(18).setFontColor('#fff').setPosition(10,10).setAnchorPoint(0,0);
  this.appendChild(this.planLabel);

  this.clearButton = new lime.GlossyButton("CLEAR").setSize(100, 30);
  this.clearButton.setAnchorPoint(0,0).setColor('#568').setPosition(75, 500);
  goog.events.listen(this.clearButton, ['click'], function(e) {
    self.clear();
  });
  this.appendChild(this.clearButton);

  this.sub = amplify.subscribe("ToolSelected", function( tool ) {
      self.addAction(tool);
  });

  amplify.subscribe("RemoveSubTool", function (tool) {
    self.updateSpriteAt(self.actions.indexOf(tool));
  });
  amplify.subscribe("PositionActions", function() {
    self.positionActions();
  });
};
goog.inherits(cc.ActionPlan, lime.Sprite);

cc.ActionPlan.prototype.addAction = function(toolName) {
  var tool = null;
  if (toolName === "TIMES") tool = new cc.ForTool();
  else tool = new cc.Tool(toolName);
  this.actions.push(tool);
  if (this.actions.length > 1) {
    var lastTool = this.actions[this.actions.length-2];
    var endLast = lastTool.getPosition().y + lastTool.getSize().height;
    tool.setPosition(15, 10+endLast);
  } else {
    // First action
    tool.setPosition(15, 40);
  }

  var self = this;
  goog.events.listen(tool.xButton, ['click'], function(e) { 
    self.removeAction(tool); 
  });

  this.scroll.appendChild(tool);
};



cc.ActionPlan.prototype.updateSpriteAt = function(index) {
  var oldSprite = this.scroll.getChildAt(index);
  var newSprite = this.actions[index].actionItem().setPosition(oldSprite.getPosition()).setAnchorPoint(0,0);
  this.scroll.removeChildAt(index)
  this.scroll.appendChild(newSprite);
  this.scroll.setChildIndex(newSprite, index);
  return newSprite;
};

cc.ActionPlan.prototype.removeAction = function(tool) {
  var index = this.actions.indexOf(tool);
  this.actions.splice(index,1);
  this.scroll.removeChildAt(index);
  this.positionActions();
  amplify.publish("RemoveDropTarget", tool);   /// For removing ForTool as a droptarget in toolbox
};

cc.ActionPlan.prototype.positionActions = function() {
  if (this.actions.length > 0) {
    this.actions[0].setPosition(15,40);
    for (var i=1; i<this.actions.length; i++) {
      var lastTool = this.actions[i-1];
      var endLast = lastTool.getPosition().y + lastTool.getSize().height;
      this.actions[i].setPosition(15, 10+endLast);
    }
  }
}

cc.ActionPlan.prototype.run = function() {
  var self = this;
  goog.events.removeAll(self.runButton);
  self.runButton.setOpacity(.6);
  if (this.actions.length < 1) {
    alert("Click on actions to give the robot directions, then click RUN to see him do them!");  
    return;
  }
  var animations = [];
  for (var i=0; i<this.actions.length; i++) {
    animations.push(this.actions[i].getAnimation());
  }
  var published = null;
  if (animations.length < 2) {
    published = animations[0];
  } else {
    published = new lime.animation.Sequence(animations);
  }
  amplify.publish("RunSequence", published);
  goog.events.listenOnce(published,lime.animation.Event.STOP,function(e){
    goog.events.listen(self.runButton, ['click'], function(e) {
      self.run();
    });
    self.runButton.setOpacity(1);
    amplify.publish("LevelAttempted", this);
  })
};

cc.ActionPlan.prototype.clear = function() {
  this.actions = [];
  this.scroll.removeAllChildren();
};

cc.ActionPlan.prototype.usesForTool = function() {
  for (var i=0; i<this.actions.length; i++) {
    if (this.actions[i] instanceof cc.ForTool) {
      return true;
    }
  }
  return false;
};


cc.ActionPlan.WIDTH = 150;
cc.ActionPlan.HEIGHT = cc.World.HEIGHT + cc.Toolbox.HEIGHT;