/*! kingkong 0.0.1 - 2015-02-06
* Copyright (c) 2015 Licensed @HighFiveGames */

describe("CommandQueue Test", function () {

	beforeEach(function () {

		this.class = new G.CommandQueue();

		sinon.stub(G, "QueueFactory").returns({
			init: jasmine.createSpy("queueFactory.init")
		});

		//sinon.spy(window, "setTimeout");
		//spyOn(window, "clearTimeout");

	});

	afterEach(function() {

		//window.setTimeout.restore();
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
		expect(this.class.queueFactory).toBeNull();
		expect(this.class.loopReturnIndex).toBe(-1);
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
		//expect(G.QueueFactory).toHaveBeenCalled();
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
					init: jasmine.createSpy("command.init").and.callThrough(function() {
						console.log('}MOCK{ Command.init');
					}),
					execute: jasmine.createSpy("command.execute").and.callThrough(function() {
						console.log('}MOCK{ Command.execute');
					}),
					loopIndex: -1,
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
			this.class.queue = [myCommand];
			this.class.executeNext();
			expect(myCommand.execute).toHaveBeenCalled();

		});

		it("executeNext: {Loops} should set loopReturnIndex if command is the start of a loop", function() {

			this.class.queue = [myCommand];
			myCommand.shouldLoop = true;
			this.class.executeNext();
			expect(this.class.loopReturnIndex).toBe(0);

		});

		it("executeNext: {Loops} if this command is last in queue, and Queue is set to loop should return currentIndex to the start of the loop", function() {

			var command1 = new Command();
			var command2 = new Command();
			var command3 = new Command();
			var command4 = new Command();
			var command5 = new Command();
			var command6 = new Command();
			var command7 = new Command();

			this.class.queue = [command1,command2,command3,command4,command5,command6, command7];
			this.class.currentIndex = 6;
			this.class.shouldLoop = true;

			jasmine.clock().install();

			this.class.executeNext();

			expect(this.class.currentIndex).toBe(0);

			jasmine.clock().uninstall();
			//expect(window, "setTimout").toHaveBeenCalled();
		});

		it("executeNext: {Loops} if this command is the last in the queue, and the Queue is not set to loop, then flush the queue", function() {

			var command1 = new Command();
			var command2 = new Command();
			var command3 = new Command();
			var command4 = new Command();
			var command5 = new Command();
			this.class.queue = [command1,command2,command3,command4,command5];
			this.class.currentIndex = 4;


			spyOn(this.class, "flushQueue");

			this.class.executeNext();

			expect(this.class.flushQueue).toHaveBeenCalled();


		});

		it("executeNext: if the command is not last in the queue, then schedule the timout to execute next command with correct delay", function() {

			var command1 = new Command();
			command1.callNextDelay = 10000;
			var command2 = new Command();
			var command3 = new Command();
			var command4 = new Command();
			var command5 = new Command();
			this.class.queue = [command1,command2,command3,command4,command5];
			this.class.currentIndex = 0;

			jasmine.clock().install();

			this.class.play();

			jasmine.clock().tick(10000);

			expect(command1.execute).toHaveBeenCalled();
			expect(command2.execute).toHaveBeenCalled();
			expect(command3.execute).not.toHaveBeenCalled();

			jasmine.clock().uninstall();



		});

		it("play function should call execute first 3 commands after 4 seconds", function() {

			var command1 = new Command();
			var command2 = new Command();
			var command3 = new Command();
			var command4 = new Command();

			this.class.queue = [command1, command2, command3, command4];

			this.class.currentIndex = 0;

			jasmine.clock().install();

			this.class.play();

			jasmine.clock().tick(4000);

			expect(command1.execute).toHaveBeenCalled();
			expect(command2.execute).toHaveBeenCalled();
			expect(command3.execute).toHaveBeenCalled();
			expect(command4.execute).not.toHaveBeenCalled();

			jasmine.clock().uninstall();

		});


	});

	it("flushQueue should clear the current Queue", function() {
		this.class.queue = [1, 2, 3, 4, 5];
		this.class.flushQueue();
		expect(this.class.queue.length).toBe(0);
	});

	//todo fix this
	xit("flushQueue should stop the timeouts in progress", function() {
		this.class.timeout = 5;
		this.class.flushQueue();
		expect(window.clearTimeout).toHaveBeenCalledWith(5);
	});









});