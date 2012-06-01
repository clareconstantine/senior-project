goog.provide('cc.Toolbox');

goog.require('cc.Tool');
goog.require('cc.World');


cc.Toolbox = function() {
  goog.base(this);

  this.tools = [new cc.Tool('move', 'move the robot', function(){
              amplify.publish("MoveRobot", 50, 0);
          })
      ];

  this.setAnchorPoint(0,0);
  this.setSize(cc.Toolbox.WIDTH, cc.Toolbox.HEIGHT);
  this.setFill('#000');
  var el = this.getDeepestDomElement();
  el.style.overflowX = "scroll";

  for (var i=0; i<this.tools.length; i++) {
    var tool = this.tools[i];
    tool.setPosition(50*i + 25, 25);
    this.appendChild(this.tools[i]);
  }
};
goog.inherits(cc.Toolbox, lime.Sprite);

cc.Toolbox.prototype.getTools = function() {
  return this.tools;
};

cc.Toolbox.WIDTH = cc.World.WIDTH;
cc.Toolbox.HEIGHT = 100;