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
  return this.animation;
};

cc.Tool.prototype.actionItem = function() {
  var sprite = new lime.Sprite();
  sprite.setAnchorPoint(0,0).setSize(100,30).setFill(this.fillColor);
  var nameLabel = new lime.Label(this.name).setAnchorPoint(0,0).setFontSize(20).setPosition(25, 5);
  sprite.appendChild(nameLabel);

  // TODO: listen for hover to become draggable, removable, etc
  return sprite;
};

cc.Tool.prototype.addSubTool = function(tool) {
  if (this.tools) {
    this.tools.push(tool);
  }
};

cc.ForTool = function() {
  goog.base(this, "times", "specify a number of times to do some actions");
  this.count = 0;
  this.tools = new Array();
  this.fxn = function() {
    for (var i=0; i<this.count; i++) {
      for (var j=0; j<this.tools.length; j++) {
        this.tools[j].execute();
      }
    }
  };
};
goog.inherits(cc.ForTool, cc.Tool)

cc.ForTool.prototype.setCount = function(count) {
  this.count = count;
};

cc.ForTool.prototype.actionItem = function() {
  var sprite = goog.base(this, "actionItem");
  var count = prompt ("Enter # of times to repeat");
  this.setCount(count);
  sprite.appendChild(new lime.Label(count).setPosition(10,10));
  return sprite;
}