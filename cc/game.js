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
  this.actionPlan.clear();
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
  var introText = "MISSION: Program your robot to advance through each cavern";
  var intro = new lime.Label(introText).setFontColor('#fff').setAnchorPoint(0,0).setPosition(
      50, 125).setFontSize(20);
  layer.appendChild(intro);

  var directions = "INSTRUCTIONS: Drag items from the toolbox to your command list on the right."
  directions += " When you're ready, click the RUN button to try your solution.";
  var dLabel = new lime.Label(directions).setFontColor('#fff').setAnchorPoint(0,0).setPosition(
      50, 175).setFontSize(20).setAlign('left').setSize(800,300);
  layer.appendChild(dLabel);

  var tutorialButton = new lime.GlossyButton('HOW TO PLAY').setSize(200,40).setPosition(475, 300).setColor('#77B');
  layer.appendChild(tutorialButton);
  goog.events.listen(tutorialButton, 'click', function() {
    self.showTutorialPageOne();
  });

  var newGameButton = new lime.GlossyButton('NEW GAME').setSize(150, 60).setPosition(475, 375).setColor('#5A5');
  goog.events.listen(newGameButton, 'click', function() {
      self.newgame();
  });
  layer.appendChild(newGameButton);

  var passwordButton = new lime.GlossyButton('Enter Level Password').setSize(200, 40).setPosition(475, 450).setColor('#77B');
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

  if (level.levelNum > 1) {
    layer.appendChild(new lime.Label("SUCCESS!").setFontColor("#fff").setFontSize(30).setPosition(450,40));
  }
  var title = new lime.Label('LEVEL ' + level.levelNum).setFontColor('#fff').setAnchorPoint(0,0).setPosition(
      50, 80).setFontSize(25);
  layer.appendChild(title);

  var objective = "OBJECTIVE: " + level.directions;
  var objectiveLabel = new lime.Label(objective).setFontColor('#fff').setAnchorPoint(0,0).setPosition(
      50, 125).setFontSize(20);
  layer.appendChild(objectiveLabel);

  //TODO: Explain new tools

  if (level.levelNum > 1) {
    var password = "PASSWORD: " + level.password;
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

// TODO: make this not be a separate function for page.
// handle pages like game levels and pass in a parameter saying which page, based on that display correct content
cc.Game.prototype.showTutorialPageOne = function() {
  var self = this;
  var scene = new lime.Scene();
  layer = new lime.Layer();
  var background = new lime.Sprite().setSize(cc.Level.WIDTH,cc.Level.HEIGHT);
  background.setAnchorPoint(0,0).setFill('#000');
  layer.appendChild(background);

  var dir1 = new lime.Label('Click or drag Commands from your toolbox to the Command list to tell the robot what to do.');
  dir1.setFontColor('#fff').setAnchorPoint(0,0).setPosition(50, 40).setFontSize(30).setSize(800,300); // need to set width
  layer.appendChild(dir1);

  var toolbox_label = new lime.Label('Toolbox').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(30).setPosition(50, 430);
  layer.appendChild(toolbox_label);

  var commandlist_label = new lime.Label('Command List').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(30).setPosition(725, 175);
  layer.appendChild(commandlist_label);

  // TODO: translate and transform arrow so it points at the correct part
 // var arrow = new lime.Polygon().setPoints(10,0,60,60,50,20,120,20,120,-20,50,-20,60,-60).setPosition(450,200).setFill('#169');
  //layer.appendChild(arrow);

  // TODO: fill in basic elements of miniWorld, label them
  var image = new lime.Sprite().setSize(.5*cc.Level.WIDTH, .5*cc.Level.HEIGHT).setAnchorPoint(0,0).setFill('#191');
  image.setPosition(.25*cc.Level.WIDTH, .25*cc.Level.HEIGHT + 25);
  layer.appendChild(image);

  var nextButton = new lime.GlossyButton('Next').setSize(60, 40).setPosition(875, 550).setColor('#5A5');
  goog.events.listen(nextButton, 'click', function(){
    // TODO: correct nav and pages of tutorial
    self.showTutorialPageTwo();
  });
  layer.appendChild(nextButton);

  var backButton = new lime.GlossyButton('Back').setSize(60, 40).setPosition(75, 550).setColor('#5A5');
  goog.events.listen(backButton, 'click', function(){
    // TODO: correct nav and pages of tutorial
    self.showStartPage();
  });
  layer.appendChild(backButton);

  scene.appendChild(layer);
  // set current scene active
  cc.director.replaceScene(scene);

};

cc.Game.prototype.showTutorialPageTwo = function() {
  var self = this;
  var scene = new lime.Scene();
  layer = new lime.Layer();
  var background = new lime.Sprite().setSize(cc.Level.WIDTH,cc.Level.HEIGHT);
  background.setAnchorPoint(0,0).setFill('#000');
  layer.appendChild(background);

  var dir1 = new lime.Label('Click RUN to try your program and see the robot follow the commands.');
  dir1.setFontColor('#fff').setAnchorPoint(0,0).setPosition(50, 40).setFontSize(30).setSize(800,300); // need to set width
  layer.appendChild(dir1);

  var run_label = new lime.Label('Run').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(30).setPosition(825, 450);
  layer.appendChild(run_label);

  // TODO: translate and transform arrow so it points at the correct part
 // var arrow = new lime.Polygon().setPoints(10,0,60,60,50,20,120,20,120,-20,50,-20,60,-60).setPosition(450,200).setFill('#169');
  //layer.appendChild(arrow);

  // TODO: fill in basic elements of miniWorld, label them
  var image = new lime.Sprite().setSize(.5*cc.Level.WIDTH, .5*cc.Level.HEIGHT).setAnchorPoint(0,0).setFill('#191');
  image.setPosition(.25*cc.Level.WIDTH, .25*cc.Level.HEIGHT + 25);
  layer.appendChild(image);

  var nextButton = new lime.GlossyButton('Next').setSize(60, 40).setPosition(875, 550).setColor('#5A5');
  goog.events.listen(nextButton, 'click', function(){
    // TODO: correct nav and pages of tutorial
    self.showTutorialPageThree();
  });
  layer.appendChild(nextButton);

  var backButton = new lime.GlossyButton('Back').setSize(60, 40).setPosition(75, 550).setColor('#5A5');
  goog.events.listen(backButton, 'click', function(){
    // TODO: correct nav and pages of tutorial
    self.showTutorialPageOne();
  });
  layer.appendChild(backButton);

  scene.appendChild(layer);
  // set current scene active
  cc.director.replaceScene(scene);

};

cc.Game.prototype.showTutorialPageThree = function() {
  var self = this;
  var scene = new lime.Scene();
  layer = new lime.Layer();
  var background = new lime.Sprite().setSize(cc.Level.WIDTH,cc.Level.HEIGHT);
  background.setAnchorPoint(0,0).setFill('#000');
  layer.appendChild(background);

  var dir1 = new lime.Label('Click the \'?\' on a command to see how it works. Click SEE MISSION and the robot will show you what he needs to do. ');
  dir1.setFontColor('#fff').setAnchorPoint(0,0).setPosition(50, 40).setFontSize(30).setSize(800,300); // need to set width
  layer.appendChild(dir1);

  var Q_label = new lime.Label('?').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(27).setPosition(120, 420);
  layer.appendChild(Q_label);

  var seeMission_label = new lime.Label('See Mission').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(30).setPosition(180, 130);
  layer.appendChild(seeMission_label);

  // TODO: translate and transform arrow so it points at the correct part
 // var arrow = new lime.Polygon().setPoints(10,0,60,60,50,20,120,20,120,-20,50,-20,60,-60).setPosition(450,200).setFill('#169');
  //layer.appendChild(arrow);

  // TODO: fill in basic elements of miniWorld, label them
  var image = new lime.Sprite().setSize(.5*cc.Level.WIDTH, .5*cc.Level.HEIGHT).setAnchorPoint(0,0).setFill('#191');
  image.setPosition(.25*cc.Level.WIDTH, .25*cc.Level.HEIGHT + 25);
  layer.appendChild(image);

  var nextButton = new lime.GlossyButton('Next').setSize(60, 40).setPosition(875, 550).setColor('#5A5');
  goog.events.listen(nextButton, 'click', function(){
    // TODO: correct nav and pages of tutorial
    self.showTutorialPageFour();
  });
  layer.appendChild(nextButton);

  var backButton = new lime.GlossyButton('Back').setSize(60, 40).setPosition(75, 550).setColor('#5A5');
  goog.events.listen(backButton, 'click', function(){
    // TODO: correct nav and pages of tutorial
    self.showTutorialPageTwo();
  });
  layer.appendChild(backButton);

  scene.appendChild(layer);
  // set current scene active
  cc.director.replaceScene(scene);

};

cc.Game.prototype.showTutorialPageFour = function() {
  var self = this;
  var scene = new lime.Scene();
  layer = new lime.Layer();
  var background = new lime.Sprite().setSize(cc.Level.WIDTH,cc.Level.HEIGHT);
  background.setAnchorPoint(0,0).setFill('#000');
  layer.appendChild(background);

  var dir1 = new lime.Label('Click the \'X\' to delete a command from the list, and click CLEAR to delete all the commands.');
  dir1.setFontColor('#fff').setAnchorPoint(0,0).setPosition(50, 40).setFontSize(30).setSize(800,300); // need to set width
  layer.appendChild(dir1);

  var X_label = new lime.Label('X').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(30).setPosition(825, 200);
  layer.appendChild(X_label);

  var clear_label = new lime.Label('Clear').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(30).setPosition(825,400);
  layer.appendChild(clear_label);

  // TODO: translate and transform arrow so it points at the correct part
 // var arrow = new lime.Polygon().setPoints(10,0,60,60,50,20,120,20,120,-20,50,-20,60,-60).setPosition(450,200).setFill('#169');
  //layer.appendChild(arrow);

  // TODO: fill in basic elements of miniWorld, label them
  var image = new lime.Sprite().setSize(.5*cc.Level.WIDTH, .5*cc.Level.HEIGHT).setAnchorPoint(0,0).setFill('#191');
  image.setPosition(.25*cc.Level.WIDTH, .25*cc.Level.HEIGHT + 25);
  layer.appendChild(image);

  var nextButton = new lime.GlossyButton('OK!').setSize(60, 40).setPosition(875, 550).setColor('#5A5');
  goog.events.listen(nextButton, 'click', function(){
    // TODO: correct nav and pages of tutorial
    self.showStartPage();
  });
  layer.appendChild(nextButton);

  var backButton = new lime.GlossyButton('Back').setSize(60, 40).setPosition(75, 550).setColor('#5A5');
  goog.events.listen(backButton, 'click', function(){
    // TODO: correct nav and pages of tutorial
    self.showTutorialPageThree();
  });
  layer.appendChild(backButton);

  scene.appendChild(layer);
  // set current scene active
  cc.director.replaceScene(scene);

}