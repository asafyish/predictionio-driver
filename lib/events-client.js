'use strict';

var Bluebird = require('bluebird');
var request = Bluebird.promisifyAll(require('request'));
var _ = require('lodash');

function isInteger(num) {
	return _.isNumber(num) && _.isFinite(num);
}

function Events(options) {

	this.options = _.assign({
		url: options.url  || process.env.PIOEventUrl || 'http://localhost',
		accessKey: options.accessKey || process.env.PIOAccessKey || null,
		port: options.port || process.env.PIOEventPort || '7070'
	}, options);

	if (!this.options.appId) {
		throw new Error('Missing app id.');
	}

	if (!isInteger(this.options.appId)) {
		throw new Error('App id must be an integer.');
	}

	this.fullUrl = this.options.url + ':' + this.options.port ;
	// For the mean time, allow invocations without accessKey
	if (this.options.accessKey) {
		this.eventsUrl = this.fullUrl + '/events.json?accessKey=' + this.options.accessKey;
	} else {
		this.eventsUrl = this.fullUrl + '/events.json';
	}
}

Events.prototype.status = function(callback) {
	return request.getAsync({
		url: this.fullUrl,
		json: true
	}).
	then(function(result) {
		if (_.isFunction(callback)) {
			callback(null, result['body']);
		}
		return result['body'];
	}).
	catch(function(err) {
		if (_.isFunction(callback)) {
			callback(err);
			return;
		}
		throw err;
	});
};

Events.prototype.createEvent = function(event, callback) {
	event.appId = this.options.appId;
	return request.postAsync({
		url: this.eventsUrl,
		json: true,
		body: event
	}).
	then(function(result) {
		if (_.isFunction(callback)) {
			callback(null, result['body']);
		}
		return result['body'];
	}).
	catch(function(err) {
		if (_.isFunction(callback)) {
			callback(err);
			return;
		}
		throw err;
	});
};


function prepareEvent(options, extra) {
	var result = _.assign({}, extra, options);

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

Events.prototype.createUser = function(options, callback) {
	var user = prepareEvent(options, {
		event: '$set',
		entityType: 'user'
	});

	return this.createEvent(user, callback);
};

Events.prototype.createItem = function(options, callback) {
	var item = _.assign(options, {
		event: '$set',
		entityType: 'item'
	});

	if (item.iid) {
		item.entityId = item.iid;
		delete item.iid;
	}

	return this.createEvent(item, callback);
};

Events.prototype.deleteItem = function(options, callback) {
    var item = _.assign(options, {
        event: '$delete',
        entityType: 'item'
    });

    if (item.iid) {
        item.entityId = item.iid;
        delete item.iid;
    }

    return this.createEvent(item, callback);
};

Events.prototype.createAction = function(options, callback) {
	var action = prepareEvent(options, {
		entityType: 'user',
		targetEntityType: 'item'
	});

	return this.createEvent(action, callback);
};

///https://docs.prediction.io/datacollection/eventapi/
Events.prototype.generateActionUrl=function(eventId) {
	var url = '';
	if (this.options.accessKey) {
		url = this.fullUrl + '/events/' + eventId + '.json?accessKey=' + this.options.accessKey;
	} else {
		url = this.fullUrl + '/events/' + eventId + '.json';
	}
	return url;
};

Events.prototype.deleteEvent = function(eventId, callback) {
	if (!eventId) {
		throw new Error('Missing event id.');
	}
	var url=this.generateActionUrl(eventId);

	return request.delAsync({
		url: url,
	}).
	then(function(result) {
		if (_.isFunction(callback)) {
			callback(null, JSON.parse(result['body']));
		}
		return JSON.parse(result['body']);
	}).
	catch(function(err) {
		if (_.isFunction(callback)) {
			callback(err);
			return;
		}
		throw err;
	});

};

Events.prototype.getEvent = function(eventId, callback) {
	if (!eventId) {
		throw new Error('Missing event id.');
	}
	var url=this.generateActionUrl(eventId);
	return request.getAsync({
		url: url,
	}).
	then(function(result) {
		if (_.isFunction(callback)) {
			callback(null, JSON.parse(result['body']));
		}
		return JSON.parse(result['body']);
	}).
	catch(function(err) {
		if (_.isFunction(callback)) {
			callback(err);
			return;
		}
		throw err;
	});

};


Events.prototype.getEvents = function(options, callback) {
	if (!options) {
		throw new Error('Missing option.');
	}
	var query = prepareEvent(options, {});
	return request.getAsync({
		url: this.eventsUrl,
		qs:query
	}).
	then(function(result) {
		if (_.isFunction(callback)) {
			callback(null, JSON.parse(result['body']));
		}
		return JSON.parse(result['body']);
	}).
	catch(function(err) {
		if (_.isFunction(callback)) {
			callback(err);
			return;
		}
		throw err;
	});

};





module.exports = Events;
