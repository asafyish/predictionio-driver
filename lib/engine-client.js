'use strict';

var Bluebird = require('bluebird');
var request = Bluebird.promisifyAll(require('request'));
var _ = require('lodash');

function Engine(options) {

	this.options = _.assign({
		url: options.url  || process.env.PIOQueryUrl || 'http://localhost',
		port: options.port || process.env.PIOQueryPort || '8000'
	}, options);


	if (!this.options.url) {
		throw new Error('Missing url for engine.');
	}

	this.queryUrl = this.options.url + ':' + this.options.port + '/queries.json';
}

Engine.prototype.sendQuery = function (options, callback) {
	return request.postAsync({url: this.queryUrl, strictSSL: this.options.strictSSL !== undefined ? this.options.strictSSL : true, body: JSON.stringify(options)}).
		then(function (result) {

			// If parsing fails, catch will bubble up the error
			var json = JSON.parse(result['body']);

			if (_.isFunction(callback)) {
				callback(null, json);
			}
			return json;
		}).
		catch(function (err) {
			if (_.isFunction(callback)) {
				return callback(err);
			}

			throw err;
		});
};

module.exports = Engine;
