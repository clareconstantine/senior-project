goog.provide('cc');

goog.require('lime.Director');

goog.require('cc.Game');

SHOW_START_PAGE = true;
//SHOW_START_PAGE = false;
PASSWORDS = ['one','two'];

// entrypoint
cc.start = function() {
	lime.scheduleManager.setDisplayRate(1000 / 60);

	cc.director = new lime.Director(document.body, 950, 600);
	cc.director.makeMobileWebAppCapable();

	var game = new cc.Game();


	if (SHOW_START_PAGE) {
		game.showStartPage();
	} else {
		game.newgame();
	}
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('cc.start', cc.start);
