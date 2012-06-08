goog.provide('cc.Toolbox');

goog.require('cc.Robot');
goog.require('cc.Tool');
goog.require('cc.ToolboxItem');
goog.require('cc.World');
goog.require('cc.Message');



cc.Toolbox = function(levelNum, actionPlan, level) {
  goog.base(this);

  this.tools = new Array();
  this.actionPlan = actionPlan;
  this.level = level;
  this.dropTargets = [this.actionPlan];

  switch (levelNum) {
    // Intentional fall-through. Each level includes the previous level's tools, plus any new ones.
    case 3:
      var forTool = new cc.ToolboxItem("TIMES", 'Tells the robot to repeat actions or set of actions.');
      this.tools.unshift(forTool);

    case 2:
      var jumpTool = new cc.ToolboxItem('JUMP', 'Makes the robot jump.');
      this.tools.unshift(jumpTool);

    case 1:
    
    default:
      var moveTool = new cc.ToolboxItem('MOVE', 'Moves the robot forward.');
      this.tools.unshift(moveTool); // unshift adds new element to beginning of array
      break;
  }

  this.setAnchorPoint(0,0);
  this.setSize(cc.Toolbox.WIDTH, cc.Toolbox.HEIGHT);
  this.setFill('#000');
  var el = this.getDeepestDomElement();
  el.style.overflowX = "scroll";

  var self = this;
  amplify.subscribe("RemoveDropTarget", function(tool) {
    self.removeDropTarget(tool);
  });
  amplify.subscribe("AddDropTarget", function(tool) {
    self.addDropTarget(tool);
  });

  for (var i=0; i<this.tools.length; i++) {
    var tool = this.tools[i];
    tool.setPosition(20+70*i, 20);
    this.appendChild(tool);
  }
};
goog.inherits(cc.Toolbox, lime.Sprite);

cc.Toolbox.prototype.addDropTarget = function(target) {
  this.dropTargets.push(target);
};

cc.Toolbox.prototype.removeDropTarget = function(target) {
  this.dropTargets.splice(this.dropTargets.indexOf(target), 1);
};


cc.Toolbox.prototype.getTools = function() {
  return this.tools;
};

cc.Toolbox.WIDTH = cc.World.WIDTH;
cc.Toolbox.HEIGHT = 100;