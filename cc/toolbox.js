goog.provide('cc.Toolbox');

goog.require('cc.Tool');
goog.require('cc.World');


cc.Toolbox = function(levelNum, actionPlan, level) {
  goog.base(this);

  this.tools = new Array();
  this.actionPlan = actionPlan;
  this.level = level;

  switch (levelNum) {
    // Intentional fall-through. Each level includes the previous level's tools, plus any new ones.
    case 3:
      var forTool = new cc.ForTool();
      this.tools.unshift(forTool);

    case 2:
      var jump = new lime.animation.Sequence(new lime.animation.MoveBy(0,-100), new lime.animation.MoveBy(0,100));
      var jumpTool = new cc.Tool('jump', 'Makes the robot jump', jump);
      this.tools.unshift(jumpTool);

    case 1:
    
    default:
      var moveTool = new cc.Tool('move', 'move the robot', new lime.animation.MoveBy(100,0));
      this.tools.unshift(moveTool); // unshift adds new element to beginning of array
      break;
  }

  this.setAnchorPoint(0,0);
  this.setSize(cc.Toolbox.WIDTH, cc.Toolbox.HEIGHT);
  this.setFill('#000');
  var el = this.getDeepestDomElement();
  el.style.overflowX = "scroll";

  for (var i=0; i<this.tools.length; i++) {
    var tool = this.tools[i];
    tool.setPosition(20+70*i, 20);
    this.appendChild(tool);

    var self = this;
    goog.events.listen(tool, ['mousedown'], function(e) {
      self.level.getParent().appendChild(tool.dragObject);
      tool.dragObject.setPosition(self.localToNode(tool.getPosition(),self.level.getParent())).setHidden(false);
      var drag = e.startDrag(false, null, tool.dragObject);
      drag.addDropTarget(self.actionPlan);
      e.event.stopPropagation();

     // Drop into target and animate
      goog.events.listen(drag, lime.events.Drag.Event.DROP, function(e){
        self.actionPlan.addAction(tool);
        tool.dragObject.setHidden(true);
      });
      
      // Move back if not dropped on target.
      goog.events.listen(drag, lime.events.Drag.Event.CANCEL, function(){
        tool.dragObject.setHidden(true);
      });

    });
  }
};
goog.inherits(cc.Toolbox, lime.Sprite);

cc.Toolbox.prototype.getTools = function() {
  return this.tools;
};

cc.Toolbox.WIDTH = cc.World.WIDTH;
cc.Toolbox.HEIGHT = 100;