//set main namespace
goog.provide('cc');

//get requirements
goog.require('lime.Director');
goog.require('lime.GlossyButton');
goog.require('lime.Label');
goog.require('lime.Layer');
goog.require('lime.Scene');

goog.require('cc.Game');

SHOW_START_PAGE = false;

// entrypoint
cc.start = function() {

	lime.scheduleManager.setDisplayRate(1000 / 60);

	cc.director = new lime.Director(document.body, 950, 600);
	cc.director.makeMobileWebAppCapable();

	if (SHOW_START_PAGE) {
		var introScene = new lime.Scene(),
		  layer = new lime.Layer();
		var background = new lime.Sprite().setSize(cc.Game.WIDTH,cc.Game.HEIGHT);
		background.setAnchorPoint(0,0);
		layer.appendChild(background);

		var title = new lime.Label('Code Caverns').setAnchorPoint(0,0).setPosition(
				275, 100).setFontSize(40).setFontWeight('bold');
		layer.appendChild(title);

		var btn = new lime.GlossyButton('START').setSize(100, 40).setPosition(400, 300).setColor('#888');
		goog.events.listen(btn, 'click', function() {
				cc.newgame();
		});
		layer.appendChild(btn);
		introScene.appendChild(layer);
		// set current scene active
		cc.director.replaceScene(introScene);
	} else {
		cc.newgame();
	}

};

cc.newgame = function() {
	var scene = new lime.Scene(),
	layer = new lime.Layer();

	scene.appendChild(layer);

	var game = new cc.Game(1);
	layer.appendChild(game);
	

	cc.director.replaceScene(scene);
};



//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('cc.start', cc.start);
