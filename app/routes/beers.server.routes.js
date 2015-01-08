'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var beers = require('../../app/controllers/beers.server.controller');

	// Beers Routes
	app.route('/beers')
		.get(beers.list)
		.post(users.requiresLogin, beers.create);

	app.route('/beers/:beerId')
		.get(beers.read)
		.put(users.requiresLogin, beers.hasAuthorization, beers.update)
		.delete(users.requiresLogin, beers.hasAuthorization, beers.delete);

	// Finish by binding the Beer middleware
	app.param('beerId', beers.beerByID);
};
