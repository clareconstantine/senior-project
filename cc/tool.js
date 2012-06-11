goog.provide('cc.Tool');

goog.require('lime.Sprite');

cc.Tool = function(name) {
  goog.base(this);

  this.name = name;
  this.fillColor = "#ddd";
  this.setAnchorPoint(0,0).setSize(100,30).setFill(this.fillColor);
  var nameLabel = new lime.Label(this.name).setAnchorPoint(0,0).setFontSize(18).setPosition(20, 5);
  this.appendChild(nameLabel);
  
  this.xButton = new lime.Label("x").setFontSize(15);
  this.xButton.setAnchorPoint(1,0).setPosition(95,0);
  this.appendChild(this.xButton);

  this.animation = null;

  switch (this.name) {
    case "MOVE":
      this.animation = cc.Robot.move(100,0);
      break;
    case "JUMP":
      this.animation = cc.Robot.jump(0);
      break;
    default:
      break;
  }

  var self = this;

  //Listen for drag
  goog.events.listen(self, ['mousedown'], function(event) {
    var actionPlan = self.getParent().getParent();
    var originalPos = self.getPosition();
    event.swallow('mouseup', function(e) {
      e.event.stopPropagation();
      return;
    });

    actionPlan.setChildIndex(self, actionPlan.getNumberOfChildren());
    var drag = event.startDrag(false, null, self);
    var dropTargets = actionPlan.dropTargets;
    for (var i=0; i<dropTargets.length; i++) {
      drag.addDropTarget(dropTargets[i]);
    }
    event.stopPropagation();

   // Drop into target
    goog.events.listen(drag, lime.events.Drag.Event.DROP, function(e){
     e.activeDropTarget.addSubTool(self.name);
     actionPlan.removeAction(self);
     e.stopPropagation();
    });
  
    goog.events.listen(drag, lime.events.Drag.Event.CANCEL, function(e) {
      self.setPosition(originalPos);
      e.stopPropagation();
    });
  });



};
goog.inherits(cc.Tool, lime.Sprite);

cc.Tool.prototype.dragObject = function() {
  var sprite = new lime.Sprite().setFill("#ddd").setAnchorPoint(0,0);
  var nameLabel = new lime.Label(this.name).setAnchorPoint(0,0).setFontSize(15).setPosition(5, 10);
  sprite.appendChild(nameLabel);
  sprite.setSize(Math.min(50, nameLabel.measureText().width+20),50);
  return sprite;
};

cc.Tool.prototype.getAnimation = function() {
  if (this.tools) {
    var animation = null;
    if (this.tools) { // For things with subtools
      var subAnimations = [];
      for (var i=0; i<this.tools.length; i++) {
        subAnimations.push(this.tools[i].getAnimation());
      }
      if (subAnimations.length < 2) {
        animation = subAnimations[0];
      } else {
        animation = new lime.animation.Sequence(subAnimations);
      }
      return animation;
    }
  }
  else {
    return this.animation;
  }
};





cc.Tool.prototype.addSubTool = function(toolName) {
  var tool = new cc.Tool(toolName);
  if (this.tools) {
    this.tools.push(tool);
    if (this.tools.length > 1) {
      var lastTool = this.tools[this.tools.length-2];
      var endLast = lastTool.getPosition().y + lastTool.getSize().height;
      tool.setPosition(10, 5+endLast);
    } else {
      // First sub tool
      tool.setPosition(10, 30);
    }
    tool.xButton.setPosition(85,0);

    var self = this;
    goog.events.listen(tool.xButton, ['click'], function(e) { 
      self.removeSubTool(tool);
    });
    
    this.appendChild(tool.setSize(90,30).setFill('#867'));
    this.resize();
    amplify.publish("PositionActions");
  }
};
cc.Tool.prototype.removeSubTool = function(tool) {
  var index = this.tools.indexOf(tool);
  this.tools.splice(index,1);
  this.removeChild(tool);
  this.positionSubTools();
  amplify.publish("PositionActions");
};
cc.Tool.prototype.positionSubTools = function() {
  if (this.tools.length > 0) {
    this.tools[0].setPosition(10,30);
    for (var i=1; i<this.tools.length; i++) {
      var lastTool = this.tools[i-1];
      var endLast = lastTool.getPosition().y + lastTool.getSize().height;
      this.tools[i].setPosition(10, 5+endLast);
    }
  }
  this.resize();
}

cc.Tool.prototype.resize = function() {
  this.setSize(100, 30+35*this.tools.length);
};

cc.ForTool = function() {
  goog.base(this, "TIMES", "Tells the robot to repeat actions or set of actions.");
  this.tools = new Array();
  this.id = "ForTool";
  this.count = parseInt(prompt("Enter # of times to repeat."));
  while (!this.count) {
    this.count = parseInt(prompt("Please enter a number. The robot will repeat the commands inside the Times tool this many times."));
  }
  this.appendChild(new lime.Label(this.count).setPosition(10,10));
  amplify.publish("AddDropTarget", this);
};
goog.inherits(cc.ForTool, cc.Tool)

cc.ForTool.prototype.getAnimation = function() {
  if (this.tools.length < 1) return new lime.animation.MoveBy(0,0);
  var singleSequence = goog.base(this, "getAnimation");
  var animation = singleSequence;
  for (var i=1; i<this.count; i++) {
    animation = new lime.animation.Sequence(singleSequence, animation);
  }
  return animation;
};