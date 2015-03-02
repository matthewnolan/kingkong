 /*! kingkong 0.2.2 - 2015-03-02
* Copyright (c) 2015 Licensed @HighFiveGames */

var G = G || {};

(function () {
	"use strict";

	/**
	 * The MeterComponent currently contains only the balance textfield
	 * Future stake selector, pay lines selector should be added to this also.
	 *
	 * @class MeterComponent
	 * @constructor
	 */
	var MeterComponent = function() {
		this.GameComponent_constructor();
	};
	var p = createjs.extend(MeterComponent, G.GameComponent);
	p.constructor = MeterComponent;

	/**
	 *
	 * @property winText
	 * @default null
	 * @type {createjs.Text}
	 */
	p.winText = new createjs.Text();

	/**
	 *
	 * @property creditText
	 * @default null
	 * @type {createjs.Text}
	 */
	p.creditText = null;

	/**
	 *
	 * @type {number}
	 */
	p.tempBalance = 0;

	/**
	 *
	 * @type {number}
	 */
	p.currentBalance = 0;

	/**
	 * @method init
	 * @param setup
	 * @param signalDispatcher
	 */
	p.init = function(setup, signalDispatcher) {
		this.GameComponent_init(setup, signalDispatcher);
		this.signalDispatcher.balanceChanged.add(this.handleBalanceUpdate, this);
	};

	/**
	 * Draws winTet and creditTextFields to stage.
	 *
	 * @method drawComponent
	 */
	p.drawComponent = function() {
		var winText = new createjs.Text("$0", "19px Arial", "#FFCC00");
		winText.textAlign = "right";
		winText.x = this.setup.stageW - this.setup.bezelMarginL + 9;
		winText.y = 6;
		this.addChild(winText);

		var creditText = new createjs.Text("Credits: " + this.setup.defaultCredits, "19px Arial", "#FFCC00");
		creditText.x = this.setup.bezelMarginL - 10;
		creditText.y = 6;
		this.addChild(creditText);
	};

	/**
	 * Signal Handler for updating balance text field
	 *
	 * @method handleBalanceUpdate
	 * @param {number} balance
	 */
	p.handleBalanceUpdate = function(balance, withRollup) {
		//G.thisGame.currentCredits = G.thisGame.currentCredits - G.setup.defaultBet;
		//G.util.updateTotal("totalCredits", G.thisGame.currentCredits);
		if (withRollup) this.rollUp(balance);

	};

	p.rollUp = function(newVal) {
		createjs.Tween.get(this, { loop: false, override: true  })
			.to({ "tempBalance": newVal }, 1000, createjs.Ease.Linear)
			.addEventListener("change", handleRollupChange);
	};

	p.handleRollUpChange = function(e) {
		console.log(this, e);
	};


	G.MeterComponent = createjs.promote(MeterComponent, "GameComponent");

})();