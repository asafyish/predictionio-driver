'use strict';

var Bluebird = require('bluebird');
var request = Bluebird.promisifyAll(require('request'));
var _ = require('underscore');

function Engine(url) {
	if (!url) {
		throw new Error('Missing url for engine. Aborting.');
	}
	this.url = url;
	this.queryUrl = this.url + '/queries.json';
}

Engine.prototype.sendQuery = function (options, callback) {
	return request.postAsync({url: this.queryUrl, json: false, body: JSON.stringify(options)}).
		then(function (result) {
			var json;
			try {
				json = JSON.parse(result[1]);
			} catch(e) {
				json = new Error('Cannot parse response: ' + result[1]);
			}
			if (_.isFunction(callback)) {
				callback(json);
			}
			return json;
		}
	);
};

module.exports = Engine;
