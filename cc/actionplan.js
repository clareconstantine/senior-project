goog.provide('cc.ActionPlan');

goog.require('cc.World');
goog.require('cc.Toolbox');
goog.require('lime.animation.Sequence');

cc.ActionPlan = function(toolbox) {
  goog.base(this);

  var self = this;

  this.actions = [];

  this.setAnchorPoint(0,0);
  this.setSize(cc.ActionPlan.WIDTH, cc.ActionPlan.HEIGHT);
  this.setFill('#000');

  this.scroll = new lime.Sprite();
  this.scroll.setSize(cc.ActionPlan.WIDTH, cc.World.HEIGHT).setAnchorPoint(0,0);
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

  this.sub = amplify.subscribe("ToolSelected", function( tool ) {
      self.addAction(tool);
  });

  amplify.subscribe("RemoveSubTool", function (tool) {
    self.updateSpriteAt(self.actions.indexOf(tool));
  });
};
goog.inherits(cc.ActionPlan, lime.Sprite);

cc.ActionPlan.prototype.addAction = function(tool, actionItem) {
  this.actions.push(tool);
  var sprite = actionItem;
  sprite.setPosition(25, 20+50*(this.actions.length-1));

  var self = this;
  goog.events.listen(sprite.xButton, ['click'], function(e) { 
    self.removeAction(tool); 
  });

  this.scroll.appendChild(sprite);
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
  for (var i=index; i<this.actions.length; i++) {
    this.scroll.getChildAt(i).setPosition(25, 20+50*i);
  }
  amplify.publish("RemoveTool", tool);
};

cc.ActionPlan.prototype.run = function() {
  var self = this;
  goog.events.removeAll(self.runButton);
  self.runButton.setOpacity(.6);
  if (this.actions.length < 1) return;
  var animations = [];
  for (var i=0; i<this.actions.length; i++) {
    animations.push(this.actions[i].getAnimation());
  }
  var published = null;
  if (animations.length < 2) {
    published = animations[0];
  } else {
     published = new lime.animation.Sequence(animations);
  };
  amplify.publish("RunSequence", published);
  goog.events.listenOnce(published,lime.animation.Event.STOP,function(e){
    goog.events.listen(self.runButton, ['click'], function(e) {
      self.run();
    });
    self.runButton.setOpacity(1);
    amplify.publish("LevelAttempted", this);
  })
};


cc.ActionPlan.WIDTH = 150;
cc.ActionPlan.HEIGHT = cc.World.HEIGHT + cc.Toolbox.HEIGHT;