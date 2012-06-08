goog.provide('cc.Toolbox');

goog.require('cc.Tool');
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
      var forTool = new cc.ForTool();
      this.tools.unshift(forTool);

    case 2:
      var jump = new lime.animation.Sequence(new lime.animation.MoveBy(0,-100), new lime.animation.MoveBy(0,100));
      var jumpTool = new cc.Tool('jump', 'Makes the robot jump', jump);
      this.tools.unshift(jumpTool);

    case 1:
    
    default:
      var moveTool = new cc.Tool('move', 'Moves the robot forward', new lime.animation.MoveBy(100,0));
      this.tools.unshift(moveTool); // unshift adds new element to beginning of array
      break;
  }

  this.setAnchorPoint(0,0);
  this.setSize(cc.Toolbox.WIDTH, cc.Toolbox.HEIGHT);
  this.setFill('#000');
  var el = this.getDeepestDomElement();
  el.style.overflowX = "scroll";

  var self = this;
  amplify.subscribe("RemoveTool", function(tool) {
    self.removeDropTarget(tool);
  });

  for (var i=0; i<this.tools.length; i++) {
    var tool = this.tools[i];
    tool.setPosition(20+70*i, 20);
    this.appendChild(tool);

    // adds ? button under each tool to display description of tool
    var descButton = new lime.Label(" ? ").setFontSize(18).setFill('#fff').setAnchorPoint(.5, 0);
    descButton.setAnchorPoint(0,0).setPosition(36+70*i,79);
    this.appendChild(descButton);
    goog.events.listen(descButton, 'click', function() {
      amplify.publish("ToolDescClicked", tool);
    });

    var self = this;
    goog.events.listen(tool, 'mousedown', function(event) {
      var dragObject = event.currentTarget.dragObject;
      var draggedTool = event.currentTarget;
      self.level.getParent().appendChild(dragObject);
      dragObject.setPosition(self.localToNode(draggedTool.getPosition(),self.level.getParent())).setHidden(false);
      var drag = event.startDrag(false, null, dragObject);
      for (var i=0; i<self.dropTargets.length; i++) {
        drag.addDropTarget(self.dropTargets[i]);
      }
      event.event.stopPropagation();

     // Drop into target and animate
      goog.events.listen(drag, lime.events.Drag.Event.DROP, function(e){
        var item = draggedTool.actionItem();
        if (e.activeDropTarget == self.actionPlan) {
          self.actionPlan.addAction(draggedTool, item);
          if (draggedTool.id == "ForTool") {
            self.addDropTarget(item);
          }
        } else {
          // add as a subtool
          var toolIndex = self.actionPlan.getChildAt(0).getChildIndex(e.activeDropTarget);
          self.actionPlan.actions[toolIndex].addSubTool(draggedTool);
          var newSprite = self.actionPlan.updateSpriteAt(toolIndex);
          self.replaceDropTarget(e.activeDropTarget, newSprite);
          e.stopPropagation();
        }
        dragObject.setHidden(true);
      });
      
      // Move back if not dropped on target.
      goog.events.listen(drag, lime.events.Drag.Event.CANCEL, function(){
        dragObject.setHidden(true);
      });

    });
  }
};
goog.inherits(cc.Toolbox, lime.Sprite);

cc.Toolbox.prototype.addDropTarget = function(target) {
  this.dropTargets.push(target);
};

cc.Toolbox.prototype.replaceDropTarget = function(old, newTarget) {
  this.dropTargets.splice(this.dropTargets.indexOf(old), 1);
  this.dropTargets.push(newTarget);
};

cc.Toolbox.prototype.removeDropTarget = function(target) {
  this.dropTargets.splice(this.dropTargets.indexOf(target), 1);
};


cc.Toolbox.prototype.getTools = function() {
  return this.tools;
};

cc.Toolbox.WIDTH = cc.World.WIDTH;
cc.Toolbox.HEIGHT = 100;