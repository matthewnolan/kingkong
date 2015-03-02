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
	 *
	 * @type {number}
	 */
	p.mockWin = 0;

	/**
	 * @method init
	 * @param setup
	 * @param signalDispatcher
	 */
	p.init = function(setup, signalDispatcher) {
		this.GameComponent_init(setup, signalDispatcher);
		this.signalDispatcher.balanceChanged.add(this.handleBalanceUpdate, this);

		this.currentBalance = this.setup.defaultCredits;
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

		this.creditText = new createjs.Text("Credits: " + this.currentBalance, "19px Arial", "#FFCC00");
		this.creditText.x = this.setup.bezelMarginL - 10;
		this.creditText.y = 6;
		this.addChild(this.creditText);
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

	/**
	 * @todo Replace with Server Integration
	 * @method mockSpinPayment
	 */
	p.mockSpinPayment = function() {
		var oldBalance = this.currentBalance;
		var newBalance = oldBalance - this.setup.defaultBet;
		this.tempBalance = oldBalance;
		this.currentBalance = newBalance;
		this.rollUp(this.currentBalance);
	};

	/**
	 * todo Replace with Server Integration
	 * @method prepareMockWin
	 * @param winAmount
	 */
	p.prepareMockWin = function(winAmount) {
		this.mockWin = winAmount;
	};

	/**
	 * @todo Replace with Server Integration
	 * @method mockGaffM1
	 */
	p.checkMockWin = function() {
		if (this.mockWin > 0) {
			var oldBalance = this.currentBalance;
			var newBalance = oldBalance + this.mockWin;
			this.tempBalance = oldBalance;
			this.currentBalance = newBalance;
			this.rollUp(this.currentBalance);
			this.mockWin = 0;
		}
	};

	p.rollUp = function(newVal) {
		var animDuration = 500;
		createjs.Tween.get(this, { loop: false, override: true  })
			.to({ "tempBalance": newVal }, animDuration, createjs.Ease.getPowOut(2.2))
			.on("change", this.handleRollUpChange, this);
	};

	p.handleRollUpChange = function() {
		var updateBalance = Math.floor(this.tempBalance);
		this.creditText.text = "Credits: " + updateBalance.toString();
	};


	G.MeterComponent = createjs.promote(MeterComponent, "GameComponent");

})();