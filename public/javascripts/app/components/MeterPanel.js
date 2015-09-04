/*! kingkong 0.3.4 - 2015-04-09
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 *
	 * @class MeterPanel
	 * @extends createjs.Container
	 * @constructor
	 */
	var MeterPanel = function() {
		this.Container_constructor();
	};

	var p = createjs.extend(MeterPanel, createjs.Container);
	p.constructor = MeterPanel;

	/**
	 * Good old setup.json stored here
	 *
	 * @property setup
	 * @type {Object}
	 */
	p.setup = null;

	/**
	 * Reference to signalDispatcher
	 *
	 * @property signalDispatcher
	 * @type {G.SignalDispatcher}
	 */
	p.signalDispatcher = null;

	/**
	 *
	 * @type {createjs.Container}
	 */
	p.panelBackground = null;

	/**
	 *
	 * @type {createjs.Container}
	 */
	p.spinButton = null;

	/**
	 *
	 * @type {createjs.Container}
	 */
	p.linesInfo = null;

	/**
	 *
	 * @type {createjs.Container}
	 */
	p.linesExpanded = null;

	/**
	 *
	 * @type {createjs.Container}
	 */
	p.betInfo = null;

	/**
	 *
	 * @type {createjs.Container}
	 */
	p.winInfo = null;

	p.linesValues = null;

	p.perLineValues = null;

	p.shelfToggleAllowed = true;
	/**
	 * Initialise Class vars and passes in instance of setup, symbolSprites
	 *
	 * @method init
	 * @param setup
	 * @param signalDispatcher
	 */
	p.init = function(setup, signalDispatcher) {
		this.setup = setup;
		this.signalDispatcher = signalDispatcher;

		this.signalDispatcher.meterShelfOpened.add(this.onMeterShelfOpened, this);
		this.signalDispatcher.meterShelfClosed.add(this.onMeterShelfClosed, this);
		this.signalDispatcher.reelSpinStart.add(this.preventShelfToggle, this);
		this.signalDispatcher.reelSpinCompleted.add(this.allowShelfToggle, this);
		this.signalDispatcher.linesPerLineChanged.add(this.onLinesPerLineChanged, this);
	};

	p.drawPanel = function() {
		var panelWidth = 100;
		var panelHeight = 256;

		this.panelBackground = new createjs.Shape();
		this.panelBackground.graphics.beginFill('#3d3d3d').drawRect(0, 0, panelWidth, panelHeight);
		this.panelBackground.setBounds(0, 0, panelWidth, panelHeight);

		this.linesExpanded = this.drawLinesExpanded();
		this.linesExpanded.x = -224;

		// drawLinesInfo depends on linesExpanded so must initialise after it
		this.linesInfo = this.drawLinesInfo();
		this.linesInfo.x = 5;
		this.linesInfo.y = 5;

		this.betInfo = this.drawBetInfo();
		this.betInfo.x = 5;
		this.betInfo.y = this.linesInfo.y + this.linesInfo.getBounds().height + 5;

		this.winInfo = this.drawWinInfo();
		this.winInfo.x = 5;
		this.winInfo.y = this.betInfo.y + this.betInfo.getBounds().height + 5;

		this.spinButton = this.drawSpinButton();
		this.spinButton.x = 5;
		this.spinButton.y = this.winInfo.y + this.winInfo.getBounds().height + 5;

		this.addChild(this.linesExpanded);
		this.addChild(this.panelBackground);
		this.addChild(this.linesInfo);
		this.addChild(this.betInfo);
		this.addChild(this.winInfo);
		this.addChild(this.spinButton);
	};

	p.drawLinesInfo = function() {
		this.linesValueTxt = this.createCenteredTextField(this.numberFormatter(this.linesExpandedSelector.value), "bold 16px Arial", "#ffffff");
		this.linesValueTxt.x = 15;

		this.perLinesValueTxt = this.createCenteredTextField(this.numberFormatter(this.perLinesExpandedSelector.value), "bold 16px Arial", "#ffffff");
		this.perLinesValueTxt.x = 65;

		this.linesValueTxt.y = this.perLinesValueTxt.y = 15;

		this.linesTxt = this.createCenteredTextField("LINES", "8px Arial", "#ffffff");
		this.linesTxt.x = 15;

		this.perLinesTxt = this.createCenteredTextField("PER LINE", "8px Arial", "#ffffff");
		this.perLinesTxt.x = this.perLinesValueTxt.x;

		this.linesTxt.y = this.perLinesTxt.y = 44;

		this.linesArrows = new createjs.Bitmap('assets/images/meter-arrows.png');
		this.linesArrows.x = 28;
		this.linesArrows.y = 5;

		var linesInfo = new createjs.Container();
		linesInfo.addChild(this.drawInfoBackground(), this.linesArrows, this.linesValueTxt, this.perLinesValueTxt, this.linesTxt, this.perLinesTxt);
		linesInfo.setBounds(0, 0, 92, 56); // Setting the bounds because createjs doesn't

		linesInfo.on('click', this.onLinesInfoClicked, this);
		return linesInfo;
	};

	p.drawLinesExpanded = function() {
		var linesExpanded = new G.MeterShelf();
		linesExpanded.init(this.signalDispatcher);

		this.linesExpandedBackground = new createjs.Shape();
		this.linesExpandedBackground.graphics.beginFill('#2c2c2c').drawRect(0, 0, 222, 256);

		this.linesExpandedTxt = this.createCenteredTextField("LINES", "16px Arial", "#ffffff");
		this.linesExpandedTxt.x = 55;

		this.perLinesExpandedTxt = this.createCenteredTextField("PER LINE", "16px Arial", "#ffffff");
		this.perLinesExpandedTxt.x = 170;

		this.linesExpandedTxt.y = this.perLinesExpandedTxt.y = 235;

		// TODO - should these line and perline values come from the SERVER?
		this.linesValues = this.setup.lineValues;
		this.perLineValues = this.setup.perLineValues;

		this.linesExpandedSelector = new G.ScrollSelector();
		this.linesExpandedSelector.init(this.linesValues, null, this.setup, this.signalDispatcher);
		this.linesExpandedSelector.drawSelector();
		this.linesExpandedSelector.x = 55;
		this.linesExpandedSelector.y = 40;

		this.perLinesExpandedSelector = new G.ScrollSelector();
		this.perLinesExpandedSelector.init(this.perLineValues, this.numberFormatter, this.setup, this.signalDispatcher);
		this.perLinesExpandedSelector.drawSelector();
		this.perLinesExpandedSelector.x = 170;
		this.perLinesExpandedSelector.y = 40;

		this.selectorLine = new createjs.Shape();
		this.selectorLine.graphics.beginFill("#ffffff").drawRect(2, 100, 216, 1).drawRect(2, 140, 216, 1);

		linesExpanded.drawContent(
			this.linesExpandedBackground,
			[
				this.linesExpandedTxt,
				this.perLinesExpandedTxt,
				this.linesExpandedSelector,
				this.perLinesExpandedSelector,
				this.selectorLine
			]
		);

		return linesExpanded;
	};

	p.drawBetInfo = function() {
		this.betValueTxt = this.createCenteredTextField(this.numberFormatter(this.getBetValue()), "bold 16px Arial", "#ffffff");
		this.betValueTxt.x = 45;
		this.betValueTxt.y = 15;

		this.betTxt = this.createCenteredTextField("BET", "16px Arial", "#ffffff");
		this.betTxt.x = 45;
		this.betTxt.y = 44;

		var betInfo = new createjs.Container();
		betInfo.addChild(this.drawInfoBackground(), this.betValueTxt, this.betTxt);
		betInfo.setBounds(0, 0, 92, 56); // Setting the bounds because createjs doesn't
		return betInfo;
	};

	p.drawWinInfo = function() {
		this.winValueTxt = this.createCenteredTextField(this.numberFormatter(0), "bold 16px Arial", "#ffffff");
		this.winValueTxt.x = 45;
		this.winValueTxt.y = 15;

		this.winTxt = this.createCenteredTextField("WIN", "16px Arial", "#ffffff");
		this.winTxt.x = 45;
		this.winTxt.y = 44;

		var winInfo = new createjs.Container();
		winInfo.addChild(this.drawInfoBackground(), this.winValueTxt, this.winTxt);
		winInfo.setBounds(0, 0, 92, 56);
		return winInfo;
	};

	p.drawSpinButton = function() {
		var data = {
			images: [
				'assets/images/meter-spin-button-down.png',
				'assets/images/meter-spin-button-out.png'
			],
			frames: [
				[0, 0, 92, 60, 0],
				[0, 0, 92, 60, 1]
			],
			animations: {
				down: 0,
				out: 1
			}
		};
		var spriteSheet = new createjs.SpriteSheet(data);
		var spinButtonSprite = new createjs.Sprite(spriteSheet);
		this.spinButtonHelper = new createjs.ButtonHelper(spinButtonSprite, "out", "out", "down", false);
		spinButtonSprite.on('click', this.onSpinButtonClicked);
		return spinButtonSprite;
	};

	p.drawInfoBackground = function() {
		this.partBackgroundBitmap = this.partBackgroundBitmap || new createjs.Bitmap('assets/images/meter-part-bg.png'); // only get the image once
		return this.partBackgroundBitmap.clone();// clone for each background
	};

	p.onLinesInfoClicked = function() {
		this.toggleShelf();
	};

	p.toggleShelf = function() {
		if(this.shelfToggleAllowed) {
			this.linesExpanded.toggle();
		}
	};

	p.onLinesPerLineChanged = function() {
		var linesValue = this.linesExpandedSelector.value,
			perLinesValue = this.perLinesExpandedSelector.value;

		this.linesValueTxt.text = this.numberFormatter(linesValue);
		this.perLinesValueTxt.text = this.numberFormatter(perLinesValue);

		this.betValueTxt.text = this.numberFormatter(this.getBetValue());
	};

	p.onSpinButtonClicked = function() {
		var reels = G.Utils.getGameComponentByClass(G.ReelsComponent);
		reels.requestSpin();
	};

	p.onMeterShelfOpened = function() {
		this.spinButtonHelper.enabled = false;
	};

	p.onMeterShelfClosed = function() {
		this.spinButtonHelper.enabled = true;
	};

	p.preventShelfToggle = function() {
		this.shelfToggleAllowed = false;
		this.linesArrows.alpha = 0.5;
	};

	p.allowShelfToggle = function() {
		this.shelfToggleAllowed = true;
		this.linesArrows.alpha = 1;
	};

	p.getBetValue = function() {
		var linesValue = this.linesExpandedSelector.value,
			perLinesValue = this.perLinesExpandedSelector.value;
		// decimal values are a pain - multiply them to an integer
		perLinesValue *= 100;
		// HACK to remove any horrible bits of wrong like 0.07 * 100 = 7.00000000001
		perLinesValue = perLinesValue.toFixed(0);
		// return to the correct value by dividing by 100
		return linesValue * perLinesValue / 100;
	};

	p.createCenteredTextField = function(text, formatting, colour) {
		var textField = new createjs.Text(text, formatting, colour);
		textField.textAlign = "center";
		textField.textBaseline = "middle";
		return textField;
	};

	p.numberFormatter = function(number) {
		var formattedNumber = "";
		if(number > 1000) {
			formattedNumber += (number * 0.001).toFixed(1).replace(".0", "");
			formattedNumber += "K";
		} else {
			formattedNumber = number;
		}
		return formattedNumber;
	};

	G.MeterPanel = createjs.promote(MeterPanel, "Container");

})();