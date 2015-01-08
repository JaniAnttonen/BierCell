'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Beer = mongoose.model('Beer'),
	_ = require('lodash');

/**
 * Create a Beer
 */
exports.create = function(req, res) {
	var beer = new Beer(req.body);
	beer.user = req.user;

	beer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(beer);
		}
	});
};

/**
 * Show the current Beer
 */
exports.read = function(req, res) {
	res.jsonp(req.beer);
};

/**
 * Update a Beer
 */
exports.update = function(req, res) {
	var beer = req.beer ;

	beer = _.extend(beer , req.body);

	beer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(beer);
		}
	});
};

/**
 * Delete an Beer
 */
exports.delete = function(req, res) {
	var beer = req.beer ;

	beer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(beer);
		}
	});
};

/**
 * List of Beers
 */
exports.list = function(req, res) { 
	Beer.find().sort('-created').populate('user', 'displayName').exec(function(err, beers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(beers);
		}
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
 * Beer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.beer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
