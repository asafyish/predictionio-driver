'use strict';

var chai = require('chai').use(require('chai-as-promised'));
var expect = chai.expect;
var assert = chai.assert;
var predictionio = require('../');


var eventsUrl= process.env.PIOEventUrl || 'http://localhost';
var eventsPort= process.env.PIOEventPort || '7070';
var queryUrl= process.env.PIOQueryUrl || 'http://localhost';
var queryPort =  process.env.PIOQueryPort ||'8000';
var accessKey=process.env.PIOAccessKey || null;


describe('Testing PredictionIO events', function () {
	var client;

	before(function () {
		client = new predictionio.Events({
			url:eventsUrl,
			accessKey:accessKey
		});
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
	var EventId;
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
			EventId=result.eventId;
			done();
		});
	});


	it('[Callback] Driver should get a action item', function (done) {
		client.getEvent(EventId, function (err, result) {
			if (err) {
				return done(err);
			}
			//console.log(result);
			expect(result).to.have.property('eventId');
			assert.equal(result.eventId, EventId, '== EventId should be equal');
			done();
		});
	});



	it('[Callback] Driver should get a action items', function (done) {
		client.getEvents({}, function (err, result) {
			if (err) {
				return done(err);
			}
			//console.log(result);
			expect(result).to.be.instanceof(Array);
			done();
		});
	});


	it('[Callback] Driver should delete a action item', function (done) {
		client.deleteEvent(EventId, function (err, result) {
			if (err) {
				return done(err);
			}
			//console.log(result);
			expect(result).to.have.property('message');
			done();
		});
	});

});


describe('Testing PredictionIO engine', function () {
	var client;

	before(function () {
		client = new predictionio.Engine({url: queryUrl});
	});

	it('Driver should be a function', function () {
		expect(predictionio.Engine).to.be.a('function');
	});


	it('[Promise] Engine should rank products', function (done) {
		client.sendQuery({
			uid: 'dummy1@example.com',
			n: 1
		}).then(function (result) {
			console.log(result);
			expect(result).to.have.property('itemScores');
			expect(result.itemScores).to.be.instanceof(Array);
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
			console.log(result);
			expect(result).to.have.property('itemScores');
			expect(result.itemScores).to.be.instanceof(Array);
			done();
		});
	});
});
