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
  this.scroll.setSize(cc.ActionPlan.WIDTH, cc.World.HEIGHT).setAnchorPoint(0,0);
  this.setAnchorPoint(0,0);
  var el = this.scroll.getDeepestDomElement();
  el.style.overflowY = "scroll";
  this.appendChild(this.scroll);

  this.runButton = new lime.GlossyButton("RUN").setSize(100,50);
  this.runButton.setAnchorPoint(0,0).setColor("#678").setPosition(75,550);
  goog.events.listen(this.runButton, ['click'], function(e) { self.run(); });
  this.appendChild(this.runButton);

  this.sub = amplify.subscribe("ToolSelected", function( tool ) {
      self.addAction(tool);
  });
};
goog.inherits(cc.ActionPlan, lime.Sprite);

cc.ActionPlan.prototype.addAction = function(tool, actionItem) {
  this.actions.push(tool);
  var sprite = actionItem;
  sprite.setPosition(25, 20+50*(this.actions.length-1));

  var xButton = new lime.Label("x").setFontSize(15);
  xButton.setAnchorPoint(1,0).setPosition(95,0);
  var self = this;
  goog.events.listen(xButton, ['click'], function(e) { 
    self.removeAction(tool); 
  });
  sprite.appendChild(xButton);

  this.scroll.appendChild(sprite);
};

cc.ActionPlan.prototype.removeAction = function(tool) {
  var index = this.actions.indexOf(tool);
  this.actions.splice(index,1);
  this.scroll.removeChildAt(index);
  for (var i=index; i<this.actions.length; i++) {
    this.scroll.getChildAt(i).setPosition(25, 20+50*i);
  }
};

cc.ActionPlan.prototype.run = function() {
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
    amplify.publish("LevelAttempted", this);
  })
};


cc.ActionPlan.WIDTH = 150;
cc.ActionPlan.HEIGHT = cc.World.HEIGHT + cc.Toolbox.HEIGHT;