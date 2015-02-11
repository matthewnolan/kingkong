/*! kingkong 0.0.6 - 2015-02-08
* Copyright (c) 2015 Licensed @HighFiveGames */
/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var Command = function() {};
	var p = Command.prototype;
	p.constructor = Command;

	p.loopIndex = 0;
	p.callNextDelay = 2000;

	p.init = function() { 

	};

	p.execute = function() {

	};

	G.Command = Command;

})();
/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var CommandQueue = function() {};
	var p = CommandQueue.prototype;
	p.constructor = CommandQueue;

	p.setup = null;
	p.queue = [];
	p.timeout = null;
	p.shouldLoop = false;
	p.loopReturnIndex = 0;
	p.queueFactory = null;
	p.currentIndex = 0;

	p.init = function(setup) {
		this.setup = setup;

		this.queueFactory = new G.QueueFactory();
		this.queueFactory.init();
	};

	p.setupQueue = function() {
		throw "not implemented";
	};

	p.play = function() {

		var len = this.queue.length;

		if (len) {
			this.executeNext(this.queue[this.currentIndex]);
		}

	};

	p.executeNext = function(command) {

		command.execute();

		if (command.loopIndex) {
			this.loopReturnIndex = command.loopIndex;
		}

		if (this.currentIndex ++ === this.queue.length - 1)
		{
			if (this.shouldLoop) {
				this.currentIndex = 0;
			} else {
				this.flushQueue();
			}
		}

		this.timeout = setTimeout(this.executeNext, command.callNextDelay);
	};

	p.stop = function() {
		throw "not implemented";
	};

	p.flushQueue = function() {
		this.queue = [];
		window.clearTimeout(this.timeout);
	};

	G.CommandQueue = CommandQueue;

})();
/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * Game class is responsible for initialising preloading of assets, storing Setup and GameState, adding GameComponents to the stage
	 * and User Interface Events can defined set here.
	 * @constructor
	 */
	var Game = function() {};
	var p = Game.prototype;
	p.constructor = Game;

	p.setup = null;

	p.serverInterface = null;

	p.stage = null;

	p.assets = null;

	/**
	 * init: Game entry point, create Preloader and accept a Display root (currently createjs.stage), and ServerInterface.
	 * Starts Preloading of assets
	 * @param {createjs.Stage} stage - The root Display Container which is added to Canvas
	 * @param {ServerInterface} serverInterface - Interface for incoming and outgoing server requests
	 */
	p.init = function(stage, serverInterface) {
		this.serverInterface = serverInterface;
		this.stage = stage;

		var preloader = new G.Preloader();
		preloader.init(this, this.SETUP_URL);
		preloader.setupComplete.add(this.onSetupLoaded, this);
		preloader.assetsLoaded.add(this.onAssetsLoadComplete, this);
		preloader.startLoad();
	};


	/**
	 * Signal Handler
	 * onSetupLoaded: setup is loaded and stored
	 * @param {Object} data - Setup Object which is loaded from setup.json file
	 */

	p.onSetupLoaded = function(data) {
		this.setup = data;
	};

	/**
	 * Signal Handler
	 * onAssetsLoadComplete: Asets have been loaded.  Now initialise the Display
	 * @param assets
	 */
	p.onAssetsLoadComplete = function(assets) {
		this.assets = assets;
		this.setupDisplay();
		this.initUIEvents();
	};

	/**
	 * setupDisplay: Start layering Containers and GameComponents.  Mask the stage for reels.
	 * nb. These are potentially expensive cpu operations, but everything done here is done after Preload and during app initialisation.
	 */
	p.setupDisplay = function() {
		var bezelMarginL = this.setup.bezelMarginL;
		var bezelMarginT = this.setup.bezelMarginT;
		var bezelW = this.setup.bezelW;
		var bezelH = this.setup.bezelH;

		//var bgLayer = new createjs.Container();
		//this.stage.addChild(bgLayer);

		var spriteSheet = new createjs.SpriteSheet(this.assets.spriteSheetStatics);
		var sprite = new createjs.Sprite(spriteSheet, 'ui-bezel');
		this.stage.addChild(sprite);

		this.reelsComponent = new G.ReelsComponent();
		this.reelsComponent.init(this.setup, spriteSheet);
		this.reelsComponent.drawReels();
		this.reelsComponent.x = bezelMarginL;
		this.reelsComponent.y = bezelMarginT;
		this.stage.addChild(this.reelsComponent);

		var sceneMask = new createjs.Shape();
		sceneMask.graphics.setStrokeStyle(0)
			.drawRect(bezelMarginL, bezelMarginT, bezelW, bezelH)
			.closePath();
		this.stage.addChild(sceneMask);

		if (!this.setup.devMode) {
			this.reelsComponent.mask = sceneMask;
		}
	};

	/**
	 * initUIEvents: keyboard control / touch controls initialise them here
	 * if User Control shouldn't be enabled during app initialisation phase, then execute this function later.
	 * @todo - configure a way to turn on/off user interaction events.
	 */
	p.initUIEvents = function() {

		var self = this;
		window.document.onkeydown = function(e) {
			switch(e.keyCode) {
				//space //enter
				case 32:
				case 0:
					self.reelsComponent.spinReels();
					break;
			}
		};

		createjs.Touch.enable(this.stage);

		var myElement = document.querySelector('#app');
		var mc = new Hammer(myElement);
		mc.get('swipe').set({
			direction: Hammer.DIRECTION_ALL
		});

		mc.get('pinch').set({
			enable: true
		});

		mc.on('swipe', function() {
			self.reelsComponent.spinReels();
		});

		mc.on('pinchin', function() {
			//G.util.showGaffMenu();
		});

		mc.on('pinchout', function() {
			//G.util.hideGaffMenu();
		});

		if (!this.setup.domHelpers) {
			$('.dom-helpers').remove();
		}

	};


	G.Game = Game;

})();
/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * The Main Class should give the app its entry point.
	 * No other entry points should be used by the index.html
	 * @class Main
	 * @constructor
	 */
	var Main = function() {};
	var p = Main.prototype;
	p.constructor = Main;

	/**
	 * Stores reference to Stats, this is a profiling tool which displays FPS and MSPF
	 * @property stats
	 * @type {Stats}
	 */
	p.stats = null;

	/**
	 * Stores a reference to Stage Object, a Special Container which is at the root of the Canvas
	 * @property stage
	 * @type {createjs.Stage}
	 */
	p.stage = null;

	/**
	 * Stores a reference to G.Game, Everything a KingKong game is created by this Object or passed into it during initialisation.
	 * @property game
	 * @type {G.Game}
	 */
	p.game = null;

	/**
	 * Application entry point initialises the canvas viewport (currently createjs) and the Game
	 * @method init
	 *
	 */
	p.init = function() {

		this.stats = new Stats();
		this.stats.setMode(0); // 0: fps, 1: ms
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.bottom = '0px';
		this.stats.domElement.style.left = '0px';
		document.body.appendChild( this.stats.domElement );

		var stageW = 667;
		var stageH = 375;
		var stageScale = 0.75;

		this.stage = new createjs.Stage("app");
		this.stage.scaleX = stageScale;
		this.stage.scaleY = stageScale;

		var mainCanvas = document.querySelector("#app");
		mainCanvas.setAttribute("width", (stageW * stageScale).toString() + "px");
		mainCanvas.setAttribute("height", (stageH * stageScale).toString() + "px");

		createjs.Ticker.on("tick", this.handleTick, this);
		createjs.Ticker.setFPS(60);

		var serverInterface = new G.ServerInterface();
		serverInterface.init();

		this.game = new G.Game();
		this.game.init(this.stage, serverInterface);

	};

	/**
	 * Render Tick which updates Stage and any profiling tool.
	 * @method handleTick
	 */
	p.handleTick = function() {
		this.stats.begin();
		this.stage.update();
		this.stats.end();
	};



	G.Main = Main;

})();
/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	/**
	 * Preloader is responsible loading Setup and assets into the Game.
	 * These include sounds, spritesheets, and data in the form of json files
	 * It will then dispatch Signals (Events) back to the Game for notification and safe caching of assets.
	 * @constructor
	 */
	var Preloader = function() {};

	var p = Preloader.prototype;
	p.constructor = Preloader;

	/**
	 * @constant SETUP_URL - path of setup.json file relative to public root.
	 * @type {string}
	 */
	p.SETUP_URL = "assets/config/setup.json";
	p.game = null;
	p.setupLoader = null;
	p.assetsLoader = null;
	p.spriteSheetBigWin = null;
	p.spriteSheetStatics = null;
	p.spriteSheetSymbolAnims = null;
	p.setupComplete = new signals.Signal();
	p.assetsLoaded = new signals.Signal();

	/**
	 * init - store a reference to game, creates a LoadQueue for Setup, creates a LoadQueue for Assets
	 * Defines Event Handlers for LoadQueues
	 * @param game
	 * @todo only pass in Setup
	 */
	p.init = function(game) {
		this.game = game;

		this.setupLoader = new createjs.LoadQueue(true);
		this.setupLoader.on("fileload", this.handleSetupLoaded, this);

		this.assetsLoader = new createjs.LoadQueue(true);
		this.assetsLoader.on("error", this.handleAssetsError, this);
		this.assetsLoader.on("progress", this.handleAssetsProgress, this);
		this.assetsLoader.on("complete", this.handleAssetsLoaded, this);
	};

	/**
	 * startLoad - starts loading setup.json file
	 */
	p.startLoad = function() {
		this.setupLoader.loadFile(this.SETUP_URL);
	};

	/**
	 * handleSetupLoaded - dispatches a Signal to Game then loads Game assets
	 * @param e
	 */
	p.handleSetupLoaded = function(e) {
		this.setupComplete.dispatch(e.result);
		this.loadGameAssets();
	};

	/**
	 * loadGameAssets - loads spritesheets defined in Setup
	 */
	p.loadGameAssets = function() {
		//console.log('loadGameAssets', this.game.setup.spritesManifest);
		this.assetsLoader.loadManifest(this.game.setup.spritesManifest);
	};

	/**
	 * handleAssetsError - handle errors in asset loading phase gracefully
	 */
	p.handleAssetsError = function() { };

	/**
	 * handleAssetsProgress - handle loading of game assets
	 */
	p.handleAssetsProgress = function() { };

	/**
	 * handleAssetsLoaded - dispatch a Signal to Game containing loaded Assets
	 */
	p.handleAssetsLoaded = function() {
		var assets = {
			spriteSheetBigWin: this.assetsLoader.getResult('bigWinAnim'),
			spriteSheetStatics: this.assetsLoader.getResult('staticImages'),
			spriteSheetSymbolAnims: this.assetsLoader.getResult('symbolAnims')
		};

		this.assetsLoaded.dispatch(assets);
	};

	G.Preloader = Preloader;

})();
/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var QueueFactory = function() {};
	var p = QueueFactory.prototype;
	p.constructor = QueueFactory;


	p.init = function() { 

	};

	G.QueueFactory = QueueFactory;

})();
/*! kingkong 0.0.1 - 2015-02-04
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var Reel = function() {
		this.Container_constructor();
	};

	var p = createjs.extend(Reel, createjs.Container);
	p.constructor = Reel;

	p.reelData = [];

	p.setup = null;

	p.symbolSprites = null;

	p.containers = {
		main: this,
		wraps: []
	};

	p.scheduleSpinStop = -2;

	/**
	 * Dynamically alter the speed of reels by changing this percentage:
	 * eg. 0.5 = half speed reels
	 * @type {number}
	 */
	p.speedPercentage = 0.5;

	/**
	 * Maximum Speed the reels can spin in pixels per second
	 * @type {number}
	 */
	p.speedConstant = 6000;

	p.spriteMap = ['ww','m1', 'm2', 'm3', 'm4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f0', 'd1', 'd2', 'd3', 'd4', 'b1', 'b2'];

	p.tween = null;

	p.scheduleSpeedChange = false;

	p.reelSpinEnd = new signals.Signal();

	p.stopTimeout = 0;

	p.spinResultIndex = null;

	p.init = function(setup, symbolSprites, reelData) {
		this.setup = setup;
		this.symbolSprites = symbolSprites;
		this.reelData = reelData;
	};

	p.getTime = function() {
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var distanceInPixels = symbolH * symbolsLen + symbolMarginB * symbolsLen;
		var time = distanceInPixels / (this.speedPercentage * this.speedConstant / 1000);
		return time;
	};

	p.getStopTime =function(index) {
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var yPos = (symbolH * index + symbolMarginB * index) + (symbolH * symbolsLen + symbolMarginB * symbolsLen);
		var time = yPos / (this.speedPercentage * this.speedConstant / 1000);
		return time;
	};

	p.drawReel = function() {
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var l, j, sp;
		for (l = 0; l < 2; l++) {
			var wrap = new createjs.Container();
			this.addChild(wrap);

			for (j = 0; j < this.reelData.length; j++) {
				sp = new createjs.Sprite(this.symbolSprites, this.spriteMap[this.reelData[j]]);
				wrap.addChild(sp);
				sp.y = (symbolH * j + symbolMarginB * j);
			}
			wrap.y = -l * (symbolH * this.reelData.length + symbolMarginB * this.reelData.length);
			this.containers.wraps.push(wrap);
		}
	};

	p.spinInfinite = function(delay, indexToFinish) {

		var self = this;
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;

		this.spinResultIndex = indexToFinish;
		this.scheduleSpinStop = -1;

		var yPos = (symbolH * symbolsLen + symbolMarginB * symbolsLen);

		createjs.Tween.get(this)
			.wait(delay).play(
			createjs.Tween.get(this, {loop: false, paused:true})
				.to({y:yPos}, this.getTime(), createjs.Ease.getElasticIn(2,5))
				.call(this.loopSpin)
		);

		this.stopTimeout = setTimeout(function() {
			self.fastStop();
		}, this.setup.reelAnimation.duration + delay);
	};

	p.loopSpin = function() {
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var yPos;
		var ease;
		if (this.scheduleSpinStop === -1){
			this.y = 0;
			yPos = (symbolH * symbolsLen + symbolMarginB * symbolsLen);
			ease = createjs.Ease.linear();
		} else {
			return;
		}

		createjs.Tween
			.get(this, {override: true, loop: false })
			.to({y: yPos}, this.getTime(), ease)
				.call(this.loopSpin);
	};


	p.stopSpin = function(index) {
		this.scheduleSpinStop = -2;
		var symbolH = this.setup.symbolH;
		var symbolMarginB = this.setup.symbolMarginBottom;
		var symbolsLen = this.reelData.length;
		var yPos = (symbolH * index + symbolMarginB * index) + (symbolH * symbolsLen + symbolMarginB * symbolsLen);
		this.y = 0;
		createjs.Tween
			.get(this, {override: true, loop:false})
			.to({y: yPos}, this.getStopTime(index), createjs.Ease.getElasticOut(2,5))
			.call(this.handleSpinComplete);
	};

	p.fastStop = function() {
		if (this.scheduleSpinStop > -2) {
			clearInterval(this.stopTimeout);
			this.stopSpin(this.spinResultIndex);
		}
	};

	p.handleSpinComplete = function() {
		console.log('handleSpinComplte');

		this.reelSpinEnd.dispatch();
	};


	p.spinSpeedIncrement = function(val) {
		if (this.speedPercentage !== val) {
			this.speedPercentage = val;
			this.scheduleSpeedChange = true;
		}
	};



	G.Reel = createjs.promote(Reel, "Container");

})();
/*! kingkong 0.0.1 - 2015-02-03
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var ReelsComponent = function() {
		this.Container_constructor();
	};

	var p = createjs.extend(ReelsComponent, createjs.Container);
	p.constructor = ReelsComponent;

	p.symbolSprites = null;

	p.setup = null;

	p.reelsData = [
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
		[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
	];

	p.reels = [];

	p.reelMap = null;

	p.reelsSpinning = 0;

	p.init = function(setup, symbolSprites) {
		this.setup = setup;
		this.symbolSprites = symbolSprites;
		this.reelsMap = setup.reelMap;

		this.initDomEvents();

		if (setup.reelAnimation.shuffleReels) {
			this.shuffleReels();
		}
	};

	p.shuffleReels = function() {
		var i, len = this.reelsData.length;
		for (i = 0; i < len; i++) {
			this.shuffle(this.reelsData[i]);
		}
	};

	p.shuffle = function(array) {
		var currentIndex = array.length, temporaryValue, randomIndex ;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	};

	p.drawReels = function() {
		var i, len = this.reelsData.length, reel;
		var symbolW = this.setup.symbolW;
		var reelMarginR = this.setup.reelMarginRight;

		for (i = 0; i < len; i++) {
			reel = new G.Reel();
			reel.init(this.setup, this.symbolSprites, this.reelsData[i]);
			this.addChild(reel);
			reel.drawReel();
			this.reels.push(reel);
			reel.x = symbolW * i + reelMarginR * i;
		}
	};

	p.spinReels = function() {
		console.log('spinReels');
		var self = this;
		var i, len = this.reels.length, reel, delay;
		var maxDelay = this.setup.reelAnimation.delay.max;

		var getDelay = function(i) {
			if (self.setup.reelAnimation.delay.random === true) {
				return Math.random() * maxDelay;
			}
			if (self.setup.reelAnimation.delay.sequenced === true) {
				return maxDelay / self.reels.length * i;
			}
		};

		if (this.reelsSpinning === 0) {
			for (i = 0; i < len; i++)
			{
				delay = getDelay(i);
				reel = this.reels[i];
				reel.spinInfinite(delay, -2);
				reel.reelSpinEnd.add(this.reelSpinEnd, this);
				this.reelsSpinning++;
			}
		} else {
			for (i = 0; i < len; i++)
			{
				reel = this.reels[i];
				reel.fastStop();
			}
		}



	};

	p.updateSpinSpeed = function(val) {
		var i, len = this.reels.length, reel;
		for (i = 0; i < len; i++)
		{
			reel = this.reels[i];
			reel.spinSpeedIncrement(val/100);
		}
	};

	p.reelSpinEnd = function() {
		console.log('this.reelsSpinning=', this.reelsSpinning);

		if (--this.reelsSpinning === 0)
		{
			console.log('REEL ANIM COMPLETE');

		}


	};

	/**
	 * DOM events
	 * for development only
	 */
	p.initDomEvents = function() {
		var self = this;
		$('#gasPedal').on('input', function(e) {
			var newSpeed = $(e.target).val();
			self.updateSpinSpeed(newSpeed);
		});
	};

	G.ReelsComponent = createjs.promote(ReelsComponent, "Container");

})();
/*! kingkong 0.0.1 - 2015-02-02
* Copyright (c) 2015 Licensed @HighFiveGames */

this.G = this.G || {};

(function () {
	"use strict";

	var ServerInterface = function() {};
	var p = ServerInterface.prototype;
	p.constructor = ServerInterface;


	p.init = function() { 

	};

	G.ServerInterface = ServerInterface;

})();
/*! kingkong 0.0.1 - 2015-02-07
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * @class WinLine
	 * @constructor
	 */
	var WinLine = function() {
		this.Container_constructor();
	};
	var p = createjs.extend(WinLine, createjs.Container);
	p.constructor = WinLine;

	/**
	 *
	 * Store data for telling the win line what to draw
	 *
	 * @property winLineSquares
	 * @required
	 * @usage 0 = Line, 1 = Square, 2 = Split Square
	 * @example - [1, 1 , 1, 0, 0] to draw winning symbol border boxes in the first 3 then a line in the final 2 [] [] [] - -
	 * @default - [0,0,0,0,0]
	 * @type {number[]}
	 */
	p.winLineSquares = [0, 0, 0, 0, 0];
	/**
	 *
	 * Store data required to locate the win line on the reel
	 *
	 * @property symbolLocations
	 * @required
	 * @usage 0 = top symbol, 1 = middle symbol, 2 = bottom symbol on a 3 line reel.  For greater visible reel height just increase the number
	 * @example - [0,0,0,1,2] would draw the line along the top row of the first 3 reels, then it would go through the next row and the last row in the final reel
	 * @default [1, 1, 1, 1, 1]
	 * @type {number[]}
	 */
	p.symbolLocations = [1, 1, 1, 1, 1];

	/**
	 * Stores the WinLine Data in preparation for drawing
	 * @method init
	 * @param {Array} winLineSquares - prepare to draw a line or square at this index
	 * @param {Array} symbolLocations - prepare to draw a line or square at this vartical location and this index
	 */
	p.init = function(winLineSquares, symbolLocations) {
		this.winLineSquares = winLineSquares;
		this.symbolLocations = symbolLocations;
	};

	/**
	 * Draws the WinLine according to stored Data
	 * @method draw
	 */
	p.draw = function() {




	};

	G.WinLine = createjs.promote(WinLine, "Container");

})();
/*! kingkong 0.0.1 - 2015-02-07
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	var WinLinesComponent = function() {
		this.Container_constructor();
	};
	var p = createjs.extend(WinLinesComponent, createjs.Container);
	p.constructor = WinLinesComponent;


	p.init = function() { 

	};

	G.WinLinesComponent = createjs.promote(WinLinesComponent, "Container");

})();