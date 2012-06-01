//set main namespace
goog.provide('cc');

//get requirements
goog.require('lime.Director');
goog.require('lime.GlossyButton');
goog.require('lime.Label');
goog.require('lime.Layer');
goog.require('lime.Scene');

goog.require('cc.ActionPlan');
goog.require('cc.Level');
goog.require('cc.Toolbox');
goog.require('cc.World');

SHOW_START_PAGE = true;
//SHOW_START_PAGE = false;
PASSWORDS = ['one','two'];

// entrypoint
cc.start = function() {
	lime.scheduleManager.setDisplayRate(1000 / 60);

	cc.director = new lime.Director(document.body, 950, 600);
	cc.director.makeMobileWebAppCapable();

	if (SHOW_START_PAGE) {
		cc.showStartPage();
	} else {
		cc.newgame();
	}

	amplify.subscribe("LevelPassed", function(level) {
		cc.playLevel(level.levelNum+1);
	});
};

cc.newgame = function() {
	cc.playLevel(1);
};

cc.playLevel = function(levelNum) {

	var level = new cc.Level(levelNum);

	cc.showLevelTitlePage(level);
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

cc.showStartPage = function() {
	var introScene = new lime.Scene(),
  layer = new lime.Layer();
	var background = new lime.Sprite().setSize(cc.Level.WIDTH,cc.Level.HEIGHT);
	background.setAnchorPoint(0,0).setFill('#000');
	layer.appendChild(background);

	var title = new lime.Label('Code Caverns!').setFontColor('#fff').setAnchorPoint(0,0).setPosition(
			350, 50).setFontSize(40);
	layer.appendChild(title);
	var introText = "Welcome to Code Caverns! Your job is to program your robot to advance through each cavern. Good luck!";
	var intro = new lime.Label(introText).setFontColor('#fff').setAnchorPoint(0,0).setPosition(
			10, 125).setFontSize(20);
	layer.appendChild(intro);

	var newGameButton = new lime.GlossyButton('NEW GAME').setSize(150, 60).setPosition(475, 300).setColor('#5A5');
	goog.events.listen(newGameButton, 'click', function() {
			cc.newgame();
	});
	layer.appendChild(newGameButton);

	var passwordButton = new lime.GlossyButton('Enter Level Password').setSize(200, 40).setPosition(475, 400).setColor('#77B');
	goog.events.listen(passwordButton, 'click', function() {
			var password = prompt('Enter a password to skip to a level:');
			var level = PASSWORDS.indexOf(password);
			if (level > -1) {
				cc.playLevel(level+1);
			} else {
				alert("Sorry, that's not a valid password. Start a new game!")
			}
	});
	layer.appendChild(passwordButton);

	introScene.appendChild(layer);
	// set current scene active
	cc.director.replaceScene(introScene);
}

cc.showLevelTitlePage = function(level) {
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
	goog.events.listen(goButton, 'click', function() {
			var levelScene = new lime.Scene();
			var levelLayer = new lime.Layer();
			levelLayer.appendChild(level);
			levelScene.appendChild(levelLayer);
			cc.director.replaceScene(levelScene);
	});
	layer.appendChild(goButton);

	scene.appendChild(layer);
	cc.director.replaceScene(scene);
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('cc.start', cc.start);
