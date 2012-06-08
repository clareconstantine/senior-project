goog.provide('cc.Game');

goog.require('lime.Director');
goog.require('lime.GlossyButton');
goog.require('lime.Label');
goog.require('lime.Layer');
goog.require('lime.Scene');

goog.require('cc.ActionPlan');
goog.require('cc.Level');
goog.require('cc.Toolbox');
goog.require('cc.World');

cc.Game = function() {
  this.robot = new cc.Robot();
  var self = this;
  amplify.subscribe("LevelPassed", function(level) {
    self.playLevel(level.levelNum+1);
  });
};
goog.inherits(cc.Game, lime.Sprite);

cc.Game.prototype.playLevel = function(levelNum) {
  if (!this.actionPlan) {
    this.actionPlan = new cc.ActionPlan().setPosition(800,0);
  }
  var level = new cc.Level(levelNum, this.robot, this.actionPlan);
  this.showLevelTitlePage(level);
};


cc.Game.prototype.newgame = function() {
  this.playLevel(1);
};

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

cc.Game.prototype.showStartPage = function() {
  var self = this;
  var introScene = new lime.Scene(),
  layer = new lime.Layer();
  var background = new lime.Sprite().setSize(cc.Level.WIDTH,cc.Level.HEIGHT);
  background.setAnchorPoint(0,0).setFill('#000');
  layer.appendChild(background);

  var title = new lime.Label('CODE CAVERNS').setFontColor('#fff').setAnchorPoint(0,0).setPosition(
      50, 50).setFontSize(40);
  layer.appendChild(title);
  var introText = "MISSION: Program your robot to advance through each cavern.";
  var intro = new lime.Label(introText).setFontColor('#fff').setAnchorPoint(0,0).setPosition(
      50, 125).setFontSize(20);
  layer.appendChild(intro);

  var directions = "INSTRUCTIONS: Drag items from the toolbox to your command list on the right."
  directions += " When you're ready, click the RUN button to try your solution.";
  var dLabel = new lime.Label(directions).setFontColor('#fff').setAnchorPoint(0,0).setPosition(
      50, 175).setFontSize(20).setAlign('left').setSize(800,300);
  layer.appendChild(dLabel);

  var newGameButton = new lime.GlossyButton('NEW GAME').setSize(150, 60).setPosition(475, 300).setColor('#5A5');
  goog.events.listen(newGameButton, 'click', function() {
      self.newgame();
  });
  layer.appendChild(newGameButton);

  var passwordButton = new lime.GlossyButton('Enter Level Password').setSize(200, 40).setPosition(475, 400).setColor('#77B');
  goog.events.listen(passwordButton, 'click', function() {
      var password = prompt('Enter a password to skip to a level:');
      var level = PASSWORDS.indexOf(password);
      if (level > -1) {
        self.playLevel(level+1,this.robot);
      } else {
        alert("Sorry, that's not a valid password. Start a new game!")
      }
  });
  layer.appendChild(passwordButton);

  introScene.appendChild(layer);
  // set current scene active
  cc.director.replaceScene(introScene);
}

cc.Game.prototype.showLevelTitlePage = function(level) {
  var scene = new lime.Scene();
  var layer = new lime.Layer();
  var background = new lime.Sprite().setSize(cc.Level.WIDTH,cc.Level.HEIGHT);
  background.setAnchorPoint(0,0).setFill('#000');
  layer.appendChild(background);

  var title = new lime.Label('Level ' + level.levelNum).setFontColor('#fff').setAnchorPoint(0,0).setPosition(
      50, 50).setFontSize(30);
  layer.appendChild(title);

  var objective = "OBJECTIVE: " + level.directions;
  var objectiveLabel = new lime.Label(objective).setFontColor('#fff').setAnchorPoint(0,0).setPosition(
      50, 125).setFontSize(20);
  layer.appendChild(objectiveLabel);

  //TODO: Explain new tools

  if (level.levelNum > 1) {
    var password = "LEVEL PASSWORD: " + level.password;
    var pLabel = new lime.Label(password).setFontColor('#fff').setAnchorPoint(0,0).setPosition(
      50, 225).setFontSize(20);
  layer.appendChild(pLabel);
  }

  var goButton = new lime.GlossyButton('OK').setSize(50, 30).setPosition(475, 300).setColor('#5A5');
  var self = this;
  goog.events.listen(goButton, 'click', function() {
      var levelScene = new lime.Scene();
      var levelLayer = new lime.Layer();
      levelLayer.appendChild(level);
      
      this.setAnchorPoint(0,0);

      levelLayer.appendChild(self.actionPlan);
      levelScene.appendChild(levelLayer);
      cc.director.replaceScene(levelScene);
  });
  layer.appendChild(goButton);

  scene.appendChild(layer);
  cc.director.replaceScene(scene);
};