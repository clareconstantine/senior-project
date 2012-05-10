//set main namespace
goog.provide('cc');

//get requirements
goog.require('lime.Director');
goog.require('lime.GlossyButton');
goog.require('lime.Layer');
goog.require('lime.Scene');

goog.require('cc.Game');

// entrypoint
cc.start = function() {

	lime.scheduleManager.setDisplayRate(1000 / 60);

	cc.director = new lime.Director(document.body, 320, 460);
	var scene = new lime.Scene(),
	    layer = new lime.Layer();


		var btn = new lime.GlossyButton('START').setSize(100, 40).setPosition(150, 100);
		goog.events.listen(btn, 'click', function() {
				cc.newgame();
		});
		layer.appendChild(btn);

	scene.appendChild(layer);

	cc.director.makeMobileWebAppCapable();
	// set current scene active
	cc.director.replaceScene(scene);

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
