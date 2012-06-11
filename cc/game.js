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

  switch (level.levelNum) {
    case 2:
      var jumpDir = new lime.Label('You learned a new command: JUMP makes the robot jump!').setFontColor(
        '#ff3').setAnchorPoint(0,0).setPosition(50, 300).setFontSize(27);
      layer.appendChild(jumpDir);
      break;
    case 3:
      var forDir = new lime.Label('You learned a new command! To make the robot do part of the command list more than once, click TIMES, say how many times to repeat, and then drag the commands you want him to do on top of the TIMES command in the command list!').setAnchorPoint(
        0,0).setPosition(50, 300).setFontSize(25).setFontColor('#ff6').setSize(800,300);
        layer.appendChild(forDir);
    default:
  }

  var goButton = new lime.GlossyButton('OK').setSize(50, 30).setPosition(475, 450).setColor('#5A5');
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
  var toolbox_line = this.drawLine(3, 170, 450, 230, 450);
  layer.appendChild(toolbox_line);

  var commandlist_label = new lime.Label('Command List').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(30).setPosition(725, 170);
  layer.appendChild(commandlist_label);
  var commandList_line = this.drawLine(3, 685, 185, 720, 185);
  layer.appendChild(commandList_line);

  var image = new lime.Sprite().setSize(.5*cc.Level.WIDTH, .5*cc.Level.HEIGHT).setAnchorPoint(0,0).setFill('miniWorld.png');
  image.setPosition(.25*cc.Level.WIDTH, .25*cc.Level.HEIGHT + 25);
  var miniWorld = new lime.Sprite().setSize
  layer.appendChild(image);

  var nextButton = new lime.GlossyButton('Next').setSize(60, 40).setPosition(875, 550).setColor('#5A5');
  goog.events.listen(nextButton, 'click', function(){
    self.showTutorialPageTwo();
  });
  layer.appendChild(nextButton);

  var backButton = new lime.GlossyButton('Back').setSize(60, 40).setPosition(75, 550).setColor('#5A5');
  goog.events.listen(backButton, 'click', function(){
    self.showStartPage();
  });
  layer.appendChild(backButton);

  scene.appendChild(layer);
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
  dir1.setFontColor('#fff').setAnchorPoint(0,0).setPosition(50, 40).setFontSize(30).setSize(800,300); 
  layer.appendChild(dir1);

  var run_label = new lime.Label('Run').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(30).setPosition(825, 435);
  layer.appendChild(run_label);
  var run_line = this.drawLine(3, 815, 450, 705, 450);
  layer.appendChild(run_line);

  var image = new lime.Sprite().setSize(.5*cc.Level.WIDTH, .5*cc.Level.HEIGHT).setAnchorPoint(0,0).setFill('miniWorld.png');
  image.setPosition(.25*cc.Level.WIDTH, .25*cc.Level.HEIGHT + 25);
  layer.appendChild(image);

  var nextButton = new lime.GlossyButton('Next').setSize(60, 40).setPosition(875, 550).setColor('#5A5');
  goog.events.listen(nextButton, 'click', function(){
    self.showTutorialPageThree();
  });
  layer.appendChild(nextButton);

  var backButton = new lime.GlossyButton('Back').setSize(60, 40).setPosition(75, 550).setColor('#5A5');
  goog.events.listen(backButton, 'click', function(){
    self.showTutorialPageOne();
  });
  layer.appendChild(backButton);

  scene.appendChild(layer);
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
  dir1.setFontColor('#fff').setAnchorPoint(0,0).setPosition(50, 40).setFontSize(30).setSize(800,300); 
  layer.appendChild(dir1);

  var Q_label = new lime.Label('?').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(27).setPosition(400,500);
  layer.appendChild(Q_label);
  var Q_line = this.drawLine(3, 330, 470, 390, 510);
  layer.appendChild(Q_line);

  var seeMission_label = new lime.Label('See Mission').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(30).setPosition(100, 130);
  layer.appendChild(seeMission_label);
  var seeMission_line = this.drawLine(3, 275, 150, 305, 165);
  layer.appendChild(seeMission_line);

  var image = new lime.Sprite().setSize(.5*cc.Level.WIDTH, .5*cc.Level.HEIGHT).setAnchorPoint(0,0).setFill('miniWorld.png');
  image.setPosition(.25*cc.Level.WIDTH, .25*cc.Level.HEIGHT + 25);
  layer.appendChild(image);

  var nextButton = new lime.GlossyButton('Next').setSize(60, 40).setPosition(875, 550).setColor('#5A5');
  goog.events.listen(nextButton, 'click', function(){
    self.showTutorialPageFour();
  });
  layer.appendChild(nextButton);

  var backButton = new lime.GlossyButton('Back').setSize(60, 40).setPosition(75, 550).setColor('#5A5');
  goog.events.listen(backButton, 'click', function(){
    self.showTutorialPageTwo();
  });
  layer.appendChild(backButton);

  scene.appendChild(layer);
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
  dir1.setFontColor('#fff').setAnchorPoint(0,0).setPosition(50, 40).setFontSize(30).setSize(800,300); 
  layer.appendChild(dir1);

  var X_label = new lime.Label('X').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(30).setPosition(825, 205);
  layer.appendChild(X_label);
  var X_line = this.drawLine(3, 815, 220, 705, 220);
  layer.appendChild(X_line);

  var clear_label = new lime.Label('Clear').setFontColor('#fff').setAnchorPoint(0,0).setFontSize(30).setPosition(825,410);
  layer.appendChild(clear_label);
  var clear_line = this.drawLine(3, 815, 425, 705, 425);
  layer.appendChild(clear_line);

  var image = new lime.Sprite().setSize(.5*cc.Level.WIDTH, .5*cc.Level.HEIGHT).setAnchorPoint(0,0).setFill('miniWorld.png');
  image.setPosition(.25*cc.Level.WIDTH, .25*cc.Level.HEIGHT + 25);
  layer.appendChild(image);

  var nextButton = new lime.GlossyButton('OK!').setSize(60, 40).setPosition(875, 550).setColor('#5A5');
  goog.events.listen(nextButton, 'click', function(){
    self.showStartPage();
  });
  layer.appendChild(nextButton);

  var backButton = new lime.GlossyButton('Back').setSize(60, 40).setPosition(75, 550).setColor('#5A5');
  goog.events.listen(backButton, 'click', function(){
    self.showTutorialPageThree();
  });
  layer.appendChild(backButton);

  scene.appendChild(layer);
  cc.director.replaceScene(scene);

};

cc.Game.prototype.drawLine = function line(size, x1, y1, x2, y2){ 
  var dx = Math.abs(x2-x1); 
  var dy = Math.abs(y2-y1); 
  var width = Math.sqrt(dx*dx+dy*dy)+size; 
  var line = new lime.Sprite().setSize(width, size).setAnchorPoint(size/2/width, .5).setRotation(-Math.atan2(y2-y1, x2-x1)*180/Math.PI);
  line.setPosition(x1, y1).setFill('#ff3');
  return line;
} 