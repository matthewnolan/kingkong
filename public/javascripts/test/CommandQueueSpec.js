/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("CommandQueue Test", function () {

	beforeEach(function () {

		this.class = new G.CommandQueue();

		sinon.stub(G, "QueueFactory").returns({
			init: jasmine.createSpy("queueFactory.init")
		});

		spyOn(window, "setTimeout");
		spyOn(window, "clearTimeout");

	});

	afterEach(function() {

		G.QueueFactory.restore();

	});

	it("Class can be instantiated", function () {
		expect(this.class).toBeDefined();
		expect(this.class).toEqual(jasmine.any(G.CommandQueue));
	});

	it("Class vars are initialised correctly", function () {
		expect(this.class.setup).toBeNull();
		expect(this.class.queue).toEqual(jasmine.any(Array));
		expect(this.class.queue.length).toBe(0);
 		expect(this.class.timeout).toBe(null);
		expect(this.class.shouldLoop).toBe(false);
		expect(this.class.queueFactory).toBeNull();
		expect(this.class.loopReturnIndex).toBe(0);
		expect(this.class.currentIndex).toBe(0);
	});

	it("init function should set a Setup object from passed arg", function() {
		var setup = "fakeSetup";
		this.class.init(setup);
		expect(this.class.setup).toBe("fakeSetup");
	});

	it("init function should create a new QueueFactory and initialise it", function() {
		var fakeQueueFactory = new G.QueueFactory();
		this.class.init();
		expect(G.QueueFactory).toHaveBeenCalled();
		expect(fakeQueueFactory.init).toHaveBeenCalled();
	});

	xit("setupQueue function should accept a queueType parameter", function() {

	});

	xit("setupQueue function should create correct animation queue based on queueType", function() {

	});

	describe("Queue Running and Looping", function() {

		var Command, myCommand;
		beforeEach(function () {

			Command = function() {
				return {
					init: jasmine.createSpy("command.init"),
					execute: jasmine.createSpy("command.execute"),
					loopIndex: 0,
					callNextDelay: 2000
				};
			};

			myCommand = new Command();

			sinon.stub().returns(myCommand);
		});

		afterEach(function() {
			myCommand = null;
		});

		it("executeNext function should execute the next command", function() {

			this.class.executeNext(myCommand);
			expect(myCommand.execute).toHaveBeenCalled();

		});

		it("executeNext: {Loops} should set loopReturnIndex if command is the start of a loop", function() {

			myCommand.loopIndex = 1;
			this.class.executeNext(myCommand);
			expect(this.class.loopReturnIndex).toBe(1);

		});

		it("executeNext: {Loops} if this command is last in queue, and Queue is set to loop should return currentIndex to the start of the loop", function() {

			myCommand.loopIndex = 1;
			this.class.queue = [1,2,3,4,5,6,7];
			this.class.currentIndex = 6;
			this.class.shouldLoop = true;

			this.class.executeNext(myCommand);

			expect(this.class.currentIndex).toBe(0);
		});

		it("executeNext: {Loops} if this command is the last in the queue, and the Queue is not set to loop, then flush the queue", function() {

			this.class.queue = [1,2,3,4,5];
			this.class.currentIndex = 4;

			spyOn(this.class, "flushQueue");

			this.class.executeNext(myCommand);

			expect(this.class.flushQueue).toHaveBeenCalled();

		});

		it("executeNext: if the command is not last in the queue, then schedule the timout to execute next command with correct delay", function() {

			this.class.queue = [1,2,3,4,5];
			this.class.currentIndex = 0;


			this.class.executeNext(myCommand);

			expect(window.setTimeout).toHaveBeenCalledWith(this.class.executeNext, myCommand.callNextDelay);

		});

		it("play function should call executeNext with the correct command in the queue", function() {

			var command1 = new Command();
			var command2 = new Command();
			var command3 = new Command();

			this.class.queue = [command1, command2, command3];
			spyOn(this.class, "executeNext");

			this.class.currentIndex = 0;

			this.class.play();

			expect(this.class.executeNext).toHaveBeenCalledWith(command1);


			this.class.currentIndex = 1;

			this.class.play();

			expect(this.class.executeNext).toHaveBeenCalledWith(command2);

			this.class.currentIndex = 2;

			this.class.play();

			expect(this.class.executeNext).toHaveBeenCalledWith(command3);
		});


	});

	it("flushQueue should clear the current Queue", function() {
		this.class.queue = [1, 2, 3, 4, 5];
		this.class.flushQueue();
		expect(this.class.queue.length).toBe(0);
	});

	it("flushQueue should stop the timeouts in progress", function() {
		this.class.timeout = 5;
		this.class.flushQueue();
		expect(window.clearTimeout).toHaveBeenCalledWith(5);
	});









});