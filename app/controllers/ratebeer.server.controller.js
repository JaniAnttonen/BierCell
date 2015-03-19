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
  rb.beerSearch(req.beer.name, function(response) {
    res.jsonp(response);
  });
};

/**
 * Beer middleware
 */
exports.beerByID = function(req, res, next, id) {
	Beer.findById(id).populate('user', 'displayName').exec(function(err, beer) {
		if (err) return next(err);
		if (! beer) return next(new Error('Failed to load Beer ' + id));
		req.beer = beer ;
		next();
	});
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
