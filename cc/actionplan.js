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

cc.ActionPlan.prototype.addAction = function(tool) {
  this.actions.push(tool);
  var sprite = tool.actionItem();
  sprite.setPosition(25, 20+50*(this.actions.length-1));
  this.scroll.appendChild(sprite);
};

cc.ActionPlan.prototype.run = function() {
   var animations = [];
  for (var i=0; i<this.actions.length; i++) {
    animations.push(this.actions[i].getAnimation());
  }
  if (animations.length > 0) {
    var sequence = new lime.animation.Sequence(animations);
    amplify.publish("RunSequence", sequence);
    goog.events.listen(sequence,lime.animation.Event.STOP,function(){
      amplify.publish("LevelAttempted", this);
    })
  } else {
    alert("Click on actions to give the robot directions, then click RUN to see him do them!");
  }
};


cc.ActionPlan.WIDTH = 150;
cc.ActionPlan.HEIGHT = cc.World.HEIGHT + cc.Toolbox.HEIGHT;