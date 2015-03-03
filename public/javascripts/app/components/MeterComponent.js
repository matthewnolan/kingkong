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
	p.winText = null;

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
	 * @type {number}
	 */
	p.tempWinAmount = 0;

	/**
	 *
	 * @type {number}
	 */
	p.currentBalance = 0;

	/**
	 *
	 * @type {number}
	 */
	p.currentWinAmount = 0;

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
		this.signalDispatcher.reelSpinStart.add(this.handleReelSpinStarted, this);
		this.currentBalance = this.setup.defaultCredits;
	};

	/**
	 * @method handleReelSpinStarted
	 */
	p.handleReelSpinStarted = function() {
		this.resetWinAmount();
		//todo replace mock functions during server integration
		this.mockSpinPayment();
	};

	p.resetWinAmount = function() {
		this.tempWinAmount = 0;
		this.handleWinAmountChange();
	};

	/**
	 * Draws winTet and creditTextFields to stage.
	 *
	 * @method drawComponent
	 */
	p.drawComponent = function() {
		this.winText = new createjs.Text(this.setup.currencySymbol + "0", "19px Arial", "#FFCC00");
		this.winText.textAlign = "right";
		this.winText.x = this.setup.stageW - this.setup.bezelMarginL + 9;
		this.winText.y = 6;
		this.addChild(this.winText);

		this.creditText = new createjs.Text("Credits: " + this.currentBalance, "19px Arial", "#FFCC00");
		this.creditText.x = this.setup.bezelMarginL - 10;
		this.creditText.y = 6;
		this.addChild(this.creditText);
	};

	/**
	 * Signal Handler for updating balance text field
	 * Currently unused, but should be called via SignalDispatcher with
	 * @todo Server Integration
	 * @method handleBalanceUpdate
	 * @param {number} balance
	 */
	p.handleBalanceUpdate = function(balance, withRollup) {
		if (withRollup) {
			this.rollUp(balance);
		} else {
			this.tempBalance = balance;
			this.handleRollUpChange(this.tempBalance);
		}
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
			this.rollUpWinAmount(this.mockWin);
			this.mockWin = 0;
		}
	};

	/**
	 * Call this method to rollUp balance text field value with argument newVal
	 * Starts a createjs.Tween which updates this.tempBalance.  Actual textfield update handled by tween's change event
	 *
	 * @method rollUp
	 * @param {number} newVal
	 */
	p.rollUp = function(newVal) {
		var animDuration = 700;
		createjs.Tween.get(this, { loop: false, override: false  })
			.to({ "tempBalance": newVal }, animDuration, createjs.Ease.getPowOut(3))
			.on("change", this.handleRollUpChange, this);
	};

	/**
	 * change event handler for rollUp tween, responsible for updating the balance text field.
	 *
	 * @method handleRollUpChange
	 */
	p.handleRollUpChange = function() {
		var updateBalance = Math.floor(this.tempBalance);
		this.creditText.text = "Credits: " + updateBalance.toString();
	};

	p.rollUpWinAmount = function(newVal) {
		var animDuration = 700;
		createjs.Tween.get(this, {loop: false, override: false})
			.to({ "tempWinAmount": newVal }, animDuration, createjs.Ease.getPowOut(3))
			.on("change", this.handleWinAmountChange, this);
	};

	/**
	 * change event handler for rollUpWinAmount win amount text field
	 *
	 * @method handlWinAmountChange
	 */
	p.handleWinAmountChange = function() {
		var updateWinAmount = Math.floor(this.tempWinAmount);
		this.winText.text = this.setup.currencySymbol + updateWinAmount.toString();
	};


	G.MeterComponent = createjs.promote(MeterComponent, "GameComponent");

})();