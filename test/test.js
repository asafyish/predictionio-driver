'use strict';

var chai = require('chai').use(require('chai-as-promised'));
var expect = chai.expect;
var predictionio = require('../');

describe('Testing PredictionIO events', function () {
	var client;

	before(function () {
		client = new predictionio.Events({appId: 1});
	});

	it('Driver should be a function', function () {
		expect(predictionio.Events).to.be.a('function');
	});

	it('Driver should throw an error if not supplied with app id', function () {
		function instantiateEvents() {
			new predictionio.Events();
		}

		expect(instantiateEvents).to.throw(Error);
	});

	it('Driver should throw an error if supplied with string app id', function () {
		function instantiateEvents() {
			new predictionio.Events({appId: '1'});
		}

		expect(instantiateEvents).to.throw(Error);
	});

	it('[Promise] Driver should return alive on status check', function () {
		return expect(client.status()).to.eventually.deep.equal({status: 'alive'});
	});

	it('[Callback] Driver should return alive on status check', function (done) {
		client.status(function (err, status) {
			if (err) {
				return done(err);
			}

			expect(status).to.deep.equal({status: 'alive'});
			done();
		});
	});

	it('[Promise] Driver should create an event', function () {
		return expect(client.createEvent({
			event: 'my_event',
			entityType: 'user',
			entityId: 'uid',
			properties: {
				prop1: 1,
				prop2: 'value2',
				prop3: [1, 2, 3],
				prop4: true,
				prop5: ['a', 'b', 'c'],
				prop6: 4.56
			},
			eventTime: new Date().toISOString()
		})).to.eventually.have.property('eventId');
	});

	it('[Callback] Driver should create an event', function (done) {
		client.createEvent({
			event: 'my_event',
			entityType: 'user',
			entityId: 'uid',
			properties: {
				prop1: 1,
				prop2: 'value2',
				prop3: [1, 2, 3],
				prop4: true,
				prop5: ['a', 'b', 'c'],
				prop6: 4.56
			},
			eventTime: new Date().toISOString()
		}, function (err, result) {
			if (err) {
				return done(err);
			}

			expect(result).to.have.property('eventId');
			done();
		});
	});

	it('[Promise] Driver should create a user', function () {
		return expect(client.createUser({uid: 'dummy1@example.com'})).to.eventually.have.property('eventId');
	});

	it('[Callback] Driver should create a user', function (done) {
		client.createUser({uid: 'dummy2@example.com'}, function (err, result) {
			if (err) {
				return done(err);
			}

			expect(result).to.have.property('eventId');
			done();
		});
	});

	it('[Promise] Driver should create an item', function () {
		return expect(client.createItem({iid: '1', properties: {itypes: ['type1']}, eventTime: new Date().toISOString()})).to.eventually.have.property('eventId');
	});

	it('[Callback] Driver should create an item', function (done) {
		client.createItem({iid: '2', properties: {itypes: ['type2']}, eventTime: new Date().toISOString()}, function (err, result) {
			if (err) {
				return done(err);
			}

			expect(result).to.have.property('eventId');
			done();
		});
	});

	it('[Promise] Driver should create a user to item action', function () {
		return expect(client.createAction({
			event: 'view',
			uid: 'dummy1@example.com',
			iid: '1',
			eventTime: new Date().toISOString()
		})).to.eventually.have.property('eventId');
	});

	it('[Callback] Driver should create a user to item action', function (done) {
		client.createAction({
			event: 'view',
			uid: 'dummy2@example.com',
			iid: '2',
			eventTime: new Date().toISOString()
		}, function (err, result) {
			if (err) {
				return done(err);
			}

			expect(result).to.have.property('eventId');
			done();
		});
	});
});

describe('Testing PredictionIO engine', function () {
	var client;

	before(function () {
		client = new predictionio.Engine({url: 'http://localhost:8000'});
	});

	it('Driver should be a function', function () {
		expect(predictionio.Engine).to.be.a('function');
	});


	it('[Promise] Engine should rank products', function (done) {
		client.sendQuery({
			uid: 'dummy1@example.com',
			n: 1
		}).then(function (result) {
			expect(result).to.have.property('items');
			expect(result.items).to.be.instanceof(Array);
			done();
		});
	});

	it('[Callback] Engine should rank products', function (done) {
		client.sendQuery({
			uid: 'dummy2@example.com',
			n: 1
		}, function (err, result) {
			if (err) {
				return done(err);
			}

			expect(result).to.have.property('items');
			expect(result.items).to.be.instanceof(Array);
			done();
		});
	});
});
