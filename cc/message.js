goog.provide('cc.Message');

cc.Message = function() {
  goog.base(this);

  this.setSize(400,200).setFill('#222').setStroke(5,'#000');
  this.setAnchorPoint(0,0);

  var self = this;
  this.setAnchorPoint(0,0);
  var button = new lime.GlossyButton('ok!').setSize(50, 30).setPosition(200, 150).setColor('#5A5');
  goog.events.listen(button, 'click', function() {
      self.hide();
  });
  this.appendChild(button);
};
goog.inherits(cc.Message, lime.Sprite);

cc.Message.prototype.hide = function() {
  this.setHidden(true);
  amplify.publish("MessageHidden");
};

cc.Message.prototype.show = function(text) {
  var text = new lime.Label(text).setFontSize(20).setFontColor('#fff').setAnchorPoint(0,0).setPosition(10,10).setAlign('left').setSize(350,200);
  this.appendChild(text);
  this.setHidden(false);
};