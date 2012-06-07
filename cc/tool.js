goog.provide('cc.Tool');

goog.require('lime.Sprite');

cc.Tool = function(name, desc, animation) {
  goog.base(this);

  this.fillColor = "#ddd";
  this.setAnchorPoint(0,0);
  this.setSize(50,50);
  this.setFill(this.fillColor);
  this.name = name || 'Code';
  this.desc = desc || 'Description';
  this.animation = animation;
  this.dragObject = this.dragObject().setHidden(true);

  nameLabel = new lime.Label(name).setAnchorPoint(0,0).setFontSize(20).setPosition(0, 10);
  this.appendChild(nameLabel);

  goog.events.listen(this, ['hover'], function(e) {
    alert(this.name);
  }, false, this);
  goog.events.listen(this, ['click'], function(e) {
    amplify.publish("ToolSelected", this);
  }, false, this);

};
goog.inherits(cc.Tool, lime.Sprite);

cc.Tool.prototype.dragObject = function() {
  var sprite = new lime.Sprite().setFill("#ddd").setAnchorPoint(0,0).setSize(50,50);
  sprite.appendChild(new lime.Label(this.name).setAnchorPoint(0,0).setPosition(0,10).setFontSize(20));
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
  var nameLabel = new lime.Label(this.name).setAnchorPoint(0,0).setFontSize(20).setPosition(25, 5);
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
  goog.base(this, "times", "specify a number of times to do some actions");
  this.count = null;
  this.tools = new Array();
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
  var singleAnimation = goog.base(this, "getAnimation");
  var animation = singleAnimation;
  for (var i=1; i<this.count; i++) {
    animation = new lime.animation.Sequence(singleAnimation, animation);
  }
  return animation;
};

cc.ForTool.prototype.setCount = function(count) {
  this.count = count;
};

cc.ForTool.prototype.actionItem = function() {
  var sprite = goog.base(this, "actionItem");
  if (!this.count) {
    this.count = prompt ("Enter # of times to repeat");
  }
  sprite.appendChild(new lime.Label(this.count).setPosition(10,10));
  for (var i=0; i<this.tools.length; i++) {
    var tool = this.tools[i];
    var subSprite = tool.actionItem().setSize(90,30).setPosition(10, 30+i*40).setFill('#855');
    // var xButton = new lime.Label("x").setFontSize(15);
    // xButton.setAnchorPoint(1,0).setPosition(95,0);
    var self = this;
    goog.events.listen(subSprite.xButton, ['click'], function(e) { 
      self.removeSubTool(tool);
    });
    //subSprite.appendChild(xButton);
    sprite.appendChild(subSprite);
  }
  sprite.setSize(sprite.getSize().width, 30 + this.tools.length*40);
  return sprite;
};