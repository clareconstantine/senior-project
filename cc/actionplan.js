goog.provide('cc.ActionPlan');

cc.ActionPlan = function(game) {
  goog.base(this);

  this.game = game;
  this.actions = [];

  this.setAnchorPoint(0,0);
  this.setSize(150, 600);
  this.setFill('#000');

  this.runButton = new lime.Sprite();
  this.runButton
  this.appendChild(this.runButton);
};
goog.inherits(cc.ActionPlan, lime.Sprite);

cc.ActionPlan.prototype.addAction = function(tool) {
  this.actions.push(tool);
  this.appendChild(this.actions[this.action.length-1]);
};

cc.ActionPlan.prototype.run = function() {
  for (var i in this.actions) {
    this.actions[i].execute();
  }
};