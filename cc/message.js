goog.provide('cc.Message');

cc.Message = function() {
  goog.base(this);

  this.setSize(400,200).setFill('#222').setStroke(5,'#000');
  this.setAnchorPoint(0,0);
  // The title message
  this.titleMsg = new lime.Label("").setFontSize(23).setFontWeight("bold").setFontColor('#fff').setAnchorPoint(0,0).setPosition(10, 10).setAlign('center').setSize(380,200);
  // The text for the message field.
  this.message =  new lime.Label("").setFontSize(22).setFontColor('#fff').setAnchorPoint(0,0).setPosition(10,40).setAlign('left').setSize(350,200);

  this.appendChild(this.titleMsg);
  this.appendChild(this.message);

  var self = this;
  this.setAnchorPoint(0,0);
  this.okButton = new lime.GlossyButton('ok!').setSize(50, 30).setPosition(200, 150).setColor('#5A5');
  goog.events.listen(this.okButton, 'click', function() {
      self.hide();
  });
  this.appendChild(this.okButton);
};
goog.inherits(cc.Message, lime.Sprite);

cc.Message.prototype.hide = function() {
  this.setHidden(true);
};

cc.Message.prototype.show = function(text, opt_text) {
  this.titleMsg.setText(opt_text || "");
  this.message.setText(text);
  this.setHidden(false);
};