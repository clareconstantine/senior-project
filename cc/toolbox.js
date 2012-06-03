goog.provide('cc.Toolbox');

goog.require('cc.Tool');
goog.require('cc.World');


cc.Toolbox = function(levelNum) {
  goog.base(this);

  this.tools = new Array();

  switch (levelNum) {
    // Intentional fall-through. Each level includes the previous level's tools, plus any new ones.
    case 3:
      var forTool = new cc.Tool('times', '');
      this.tools.unshift(forTool);

    case 2:
      var jump = new lime.animation.Sequence(new lime.animation.MoveBy(0,-100), new lime.animation.MoveBy(0,100));
      var jumpTool = new cc.Tool('jump', 'Makes the robot jump', jump);
      this.tools.unshift(jumpTool);

    case 1:
    
    default:
      var moveTool = new cc.Tool('move', 'move the robot', new lime.animation.MoveBy(100,0));
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
    //tool.setAnchorPoint(.5,.5);
    tool.setPosition(20+70*i, 20);
    this.appendChild(tool);
  }
};
goog.inherits(cc.Toolbox, lime.Sprite);

cc.Toolbox.prototype.getTools = function() {
  return this.tools;
};

cc.Toolbox.WIDTH = cc.World.WIDTH;
cc.Toolbox.HEIGHT = 100;