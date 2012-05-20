goog.provide('cc.Tool');

cc.Tool = function(name, desc, fxn, robot) {
  goog.base(this);

  this.setAnchorPoint(0,0);
  this.setSize(50,50);
  this.setFill("#ddd");
  this.name = name || 'Code';
  this.desc = desc || 'Description';
  this.fxn = fxn || (function(){ alert(name)});
  this.robot = robot;

  nameLabel = new lime.Label(name).setAnchorPoint(0,0).setFontSize(20).setPosition(0, 10);
  this.appendChild(nameLabel);

  goog.events.listen(this, ['hover'], function(e) {
    alert(this.name);
  }, false, this);
  goog.events.listen(this, ['click'], function(e) {
    this.fxn();
  }, false, this);
};
goog.inherits(cc.Tool, lime.Sprite);
