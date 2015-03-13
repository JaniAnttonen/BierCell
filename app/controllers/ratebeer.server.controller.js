'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    rb = require('ratebeer-api'),
    Beer = mongoose.model('Beer'),
    _ = require('lodash');

/**
 * Get ratebeer score for a beer
 */
exports.get = function(req, res) {
	res.jsonp(req.beer);
};

/**
 * Ratebeer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.beer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
