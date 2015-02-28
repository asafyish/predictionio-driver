'use strict';

var Bluebird = require('bluebird');
var request = Bluebird.promisifyAll(require('request'));
var _ = require('lodash');

function Engine(options) {

	this.options = _.assign({
		url: 'http://localhost:8000'
	}, options);

	if (!this.options.url) {
		throw new Error('Missing url for engine.');
	}

	this.queryUrl = this.options.url + '/queries.json';
}

Engine.prototype.sendQuery = function (options, callback) {
	return request.postAsync({url: this.queryUrl, body: JSON.stringify(options)}).
		then(function (result) {
			var json = JSON.parse(result[1]);

			if (_.isFunction(callback)) {
				callback(null, json);
			}
			return json;
		}).
		catch(function (err) {
			if (_.isFunction(callback)) {
				callback(err);
				return;
			}
			throw err;
		});
};

module.exports = Engine;
