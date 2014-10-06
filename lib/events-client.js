'use strict';

var Bluebird = require('bluebird');
var request = Bluebird.promisifyAll(require('request'));
var _ = require('underscore');

// TODO Try to replace with something out of underscore
function isInteger(num) {
	return typeof num === 'number' && isFinite(num) && num % 1 === 0;
}

function Events(appId, url) {
	if (!appId) {
		throw new Error('Missing app id. Aborting.');
	}

	if (!isInteger(appId)) {
		throw new Error('App id must be an integer.');
	}

	this.appId = appId;
	this.url = url || 'http://localhost:7070';
	this.eventsUrl = this.url + '/events.json';
}

Events.prototype.status = function (callback) {
	return request.getAsync({url: this.url, json: true}).
		then(function (result) {
			if (_.isFunction(callback)) {
				callback(null, result[1]);
			}
			return result[1];
		}).
		catch(function (err) {
			if (_.isFunction(callback)) {
				callback(err);
			}
			return err;
		});
};

Events.prototype.createEvent = function (event, callback) {
	event.appId = this.appId;
	return request.postAsync({url: this.eventsUrl, json: true, body: event}).
		then(function (result) {
			if (_.isFunction(callback)) {
				callback(null, result[1]);
			}
			return result[1];
		}).
		catch(function (err) {
			if (_.isFunction(callback)) {
				callback(err);
			}
			return err;
		});
};

function prepareEvent(options, extra) {
	var result = _.extend(options, extra);

	if (result.hasOwnProperty('uid')) {
		result.entityId = result.uid;
		delete result.uid;
	}

	if (result.hasOwnProperty('iid')) {
		result.targetEntityId = result.iid;
		delete result.iid;
	}

	return result;
}

Events.prototype.createUser = function (options, callback) {
	var user = prepareEvent(options, {
		event: '$set',
		entityType: 'pio_user'
	});

	return this.createEvent(user, callback);
};

Events.prototype.createItem = function (options, callback) {
	var item = _.extend(options, {
		event: '$set',
		entityType: 'pio_item'
	});

	if (item.iid) {
		item.entityId = item.iid;
		delete item.iid;
	}

	return this.createEvent(item, callback);
};

Events.prototype.createAction = function (options, callback) {
	var action = prepareEvent(options, {
		entityType: 'pio_user',
		targetEntityType: 'pio_item'
	});

	return this.createEvent(action, callback);
};

module.exports = Events;
