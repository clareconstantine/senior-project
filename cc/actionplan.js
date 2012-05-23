goog.provide('cc.ActionPlan');

cc.ActionPlan = function() {
  goog.base(this);
  var self = this;

  this.actions = [];

  this.setAnchorPoint(0,0);
  this.setSize(150, 600);
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
  for (var i in this.actions) {
    this.actions[i].execute();
  }
};