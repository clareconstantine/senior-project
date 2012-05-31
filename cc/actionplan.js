goog.provide('cc.ActionPlan');

goog.require('cc.World');
goog.require('cc.Toolbox');

cc.ActionPlan = function() {
  goog.base(this);

  var self = this;

  this.actions = [];

  this.setAnchorPoint(0,0);
  this.setSize(cc.ActionPlan.WIDTH, cc.ActionPlan.HEIGHT);
  this.setFill('#000');

  this.runButton = new lime.Label("RUN").setAnchorPoint(0,0).setSize(100,50);
  this.runButton.setFill("#678").setPosition(25,475);
  goog.events.listen(this.runButton, ['click'], function(e) { self.run(); });
  this.appendChild(this.runButton);

  amplify.subscribe("ToolSelected", function( tool ) {
      self.addAction(tool);
  });
};
goog.inherits(cc.ActionPlan, lime.Sprite);

cc.ActionPlan.prototype.addAction = function(tool) {
  this.actions.push(tool);
  var sprite = tool.actionItem();
  sprite.setPosition(25, 20+50*(this.actions.length-1));
  this.appendChild(sprite);
};

cc.ActionPlan.prototype.run = function() {
  for (var i=0; i<this.actions.length; i++) {
    this.actions[i].execute();
  }
};



cc.ActionPlan.WIDTH = 150;
cc.ActionPlan.HEIGHT = cc.World.HEIGHT + cc.Toolbox.HEIGHT;