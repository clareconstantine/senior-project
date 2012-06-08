goog.provide('cc.ToolboxItem');

cc.ToolboxItem = function(name, description) {
  goog.base(this);

  this.fillColor = "#ddd";
  this.setAnchorPoint(0,0);
  this.setFill(this.fillColor);
  this.name = name || 'Code';
  this.desc = description || 'Description';
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

  //Listen for clicks & drags
  goog.events.listen(self, ['mousedown'], function(event) {
    var context = self.getParent().level.getParent();
    var actionPlan = self.getParent().actionPlan;
    var tool = event.currentTarget;
    
    event.swallow('mouseup', function(e) {
      if (!self.dragging) {
        actionPlan.addAction(self.name);
      } else {
        self.dragging = false;
        e.event.stopPropagation();
      }
    });
    event.swallow('mousemove', function() {
      if (!self.dragging) {
        self.dragging = true;
        var dragObject = event.currentTarget.dragObject;
        context.appendChild(dragObject);
        dragObject.setPosition(self.getParent().localToNode(self.getPosition(),context)).setHidden(false);

        var drag = event.startDrag(false, null, dragObject);
        var dropTargets = self.getParent().dropTargets;
        for (var i=0; i<dropTargets.length; i++) {
          drag.addDropTarget(dropTargets[i]);
        }
        event.stopPropagation();

       // Drop into target
        goog.events.listen(drag, lime.events.Drag.Event.DROP, function(e){
          if (e.activeDropTarget == actionPlan) {
            actionPlan.addAction(self.name);
            // if (self.id == "ForTool") {
            //   self.addDropTarget(item);
            // }
          } else {
           e.activeDropTarget.addSubTool(self.name);
           e.stopPropagation();
          }
          dragObject.setHidden(true);
          self.dragging = false;
        });
      
        goog.events.listen(drag, lime.events.Drag.Event.CANCEL, function(e) {
          dragObject.setHidden(true);
          self.dragging = false;
          e.stopPropagation();
        });
      }
    });

  });
};
goog.inherits(cc.ToolboxItem, lime.Sprite);

cc.ToolboxItem.prototype.dragObject = function() {
  var sprite = new lime.Sprite().setFill("#ddd").setAnchorPoint(0,0);
  var nameLabel = new lime.Label(this.name).setAnchorPoint(0,0).setFontSize(15).setPosition(5, 10);
  sprite.appendChild(nameLabel);
  sprite.setSize(Math.min(50, nameLabel.measureText().width+20),50);
  return sprite;
};