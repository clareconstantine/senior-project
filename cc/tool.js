goog.provide('cc.Tool');

goog.require('lime.Sprite');

cc.Tool = function(name, desc, animation) {
  goog.base(this);

  this.fillColor = "#ddd";
  this.setAnchorPoint(0,0);
  this.setFill(this.fillColor);
  this.name = name || 'Code';
  this.desc = desc || 'Description';
  this.animation = animation;
  this.dragObject = this.dragObject().setHidden(true);

  var nameLabel = new lime.Label(this.name).setAnchorPoint(0,0).setFontSize(15).setPosition(5, 10);
  this.appendChild(nameLabel);
  this.setSize(Math.min(50, nameLabel.measureText().width+20),50);

  this.startedDragging = false;

  // adds ? button under each tool to display description of tool
  var self = this;
  var descButton = new lime.Label("?").setFontSize(15).setAnchorPoint(1, 1).setPosition(46,48);
  this.appendChild(descButton);
  goog.events.listen(descButton, ['mousedown', 'click'], function(e) {
    amplify.publish("ShowDescription", self.desc, self.name);
    e.event.stopPropagation();
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
  if (this.animation) return this.animation;
  else {
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
};

cc.Tool.prototype.actionItem = function() {
  var sprite = new lime.Sprite();
  sprite.setAnchorPoint(0,0).setSize(100,30).setFill(this.fillColor);
  var nameLabel = new lime.Label(this.name).setAnchorPoint(0,0).setFontSize(18).setPosition(20, 5);
  sprite.appendChild(nameLabel);
  
  sprite.xButton = new lime.Label("x").setFontSize(15);
  sprite.xButton.setAnchorPoint(1,0).setPosition(95,0);
  sprite.appendChild(sprite.xButton);

  // TODO: listen for hover to become draggable, removable, etc
  return sprite;
};

cc.Tool.prototype.addSubTool = function(tool) {
  if (this.tools) {
    this.tools.push(tool);
  }
};
cc.Tool.prototype.removeSubTool = function(tool) {
  if (this.tools) {
    var oldSelf = this;
    this.tools.splice(this.tools.indexOf(tool),1);
    var self = this;
    amplify.publish("RemoveSubTool", oldSelf, self);
  }
};

cc.ForTool = function() {
  goog.base(this, "TIMES", "specify a number of times to do some actions");
  this.count = null;
  this.tools = new Array();
  this.desc = 'Tells the robot to repeat actions or sets of actions';
  this.id = "ForTool";

  this.showDropHighlight = function(){
    this.runAction(new lime.animation.FadeTo(.6).setDuration(.3));
  };
  this.hideDropHighlight = function(){
    this.runAction(new lime.animation.FadeTo(1).setDuration(.1));
  };
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

cc.ForTool.prototype.setCount = function(count) {
  this.count = count;
};

cc.ForTool.prototype.actionItem = function() {
  var sprite = goog.base(this, "actionItem");
  if(!this.count) {
    this.count = parseInt(prompt("Enter # of times to repeat"));
    while (!this.count) {
      this.count = parseInt(prompt("Please enter a number. The robot will repeat the commands inside the Times tool this many times."));
    }
  }
  sprite.appendChild(new lime.Label(this.count).setPosition(10,10));
  for (var i=0; i<this.tools.length; i++) {
    var tool = this.tools[i];
    var subSprite = tool.actionItem().setSize(90,30).setPosition(10, 30+i*40).setFill('#855');
    var self = this;
    goog.events.listen(subSprite.xButton, ['click'], function(e) { 
      self.removeSubTool(tool);
    });
    sprite.appendChild(subSprite);
  }
  sprite.setSize(sprite.getSize().width, 30 + this.tools.length*40);
  return sprite;
};
