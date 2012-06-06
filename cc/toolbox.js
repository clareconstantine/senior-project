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

  for (var i=0; i<this.tools.length; i++) {
    var tool = this.tools[i];
    tool.setPosition(20+70*i, 20);
    this.appendChild(tool);

    var self = this;
    // adds ? button under each tool to display description of tool
    var descMessage = new cc.Message(tool.desc);
    // TODO: have it display over level not toolbox if possible
    descMessage.setPosition(200, 100).setHidden(true);
    this.appendChild(descMessage);
    var descButton = new lime.Label(" ? ").setFontSize(18).setFill('#fff').setAnchorPoint(.5, 0);
    descButton.setAnchorPoint(0,0).setPosition(36+70*i,79);
    console.log(descMessage);
    goog.events.listen(descButton, ['click'], (function(message) { return (function(e) { message.show(); }) })(descMessage));
      // doesn't hide when you click ok...
      // also can't display a second one.
      // after opening one, clicking the other's button causes js error about adding null undefined actions

    this.appendChild(descButton); 

    goog.events.listen(tool, 'mousedown', function(e) {
      var dragObject = e.currentTarget.dragObject;
      var draggedTool = e.currentTarget;
      self.level.getParent().appendChild(dragObject);
      dragObject.setPosition(self.localToNode(draggedTool.getPosition(),self.level.getParent())).setHidden(false);
      var drag = e.startDrag(false, null, dragObject);
      for (var i=0; i<self.dropTargets.length; i++) {
        drag.addDropTarget(self.dropTargets[i]);
      }
      e.event.stopPropagation();

     // Drop into target and animate
      goog.events.listen(drag, lime.events.Drag.Event.DROP, function(e){
        var item = draggedTool.actionItem();
        self.actionPlan.addAction(draggedTool, item);
        self.addDropTarget(item);
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

cc.Toolbox.prototype.getTools = function() {
  return this.tools;
};

cc.Toolbox.WIDTH = cc.World.WIDTH;
cc.Toolbox.HEIGHT = 100;