goog.provide('cc.Tool');

goog.require('lime.Sprite');

cc.Tool = function(name, desc, fxn) {
  goog.base(this);

  this.fillColor = "#ddd";
  this.setAnchorPoint(0,0);
  this.setSize(50,50);
  this.setFill(this.fillColor);
  this.name = name || 'Code';
  this.desc = desc || 'Description';
  this.fxn = fxn || (function(){ alert(name)});

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

cc.Tool.prototype.execute = function() {
  this.fxn();
};

cc.Tool.prototype.actionItem = function() {
  var sprite = new lime.Sprite();
  sprite.setAnchorPoint(0,0).setSize(100,30).setFill(this.fillColor);
  nameLabel = new lime.Label(this.name).setAnchorPoint(0,0).setFontSize(20).setPosition(25, 5);
  sprite.appendChild(nameLabel);
  // TODO: listen for hover to become draggable, removable, etc
  // TODO: remove below
  // goog.events.listen(sprite, ['click'], function(e) {
  //   this.execute();
  // }, false, this);
  return sprite;
};