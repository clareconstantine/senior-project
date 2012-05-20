goog.provide('cc.Toolbox');

goog.require('cc.Tool');

cc.Toolbox = function(robot) {
  goog.base(this);

  this.robot = robot;
  this.tools = [new cc.Tool('move', 'move the robot', function(){
              this.robot.move(50, 0);
          }, this.robot)
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