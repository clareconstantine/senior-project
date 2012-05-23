goog.provide('cc.Toolbox');

goog.require('cc.Tool');

cc.Toolbox = function() {
  goog.base(this);

  this.tools = [new cc.Tool('move', 'move the robot', function(){
              amplify.publish("MoveRobot", 50, 0);
          })
      ];

  this.setAnchorPoint(0,0);
  this.setSize(800, 100);
  this.setFill('#000');

  for (var i in this.tools) {
    var tool = this.tools[i];
    tool.setPosition(50*i + 25, 25);
    this.appendChild(this.tools[i]);
  }
};
goog.inherits(cc.Toolbox, lime.Sprite);

cc.Toolbox.prototype.getTools = function() {
  return this.tools;
};