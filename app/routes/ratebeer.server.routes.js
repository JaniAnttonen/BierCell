'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var ratebeer = require('../../app/controllers/ratebeer.server.controller');

	// Ratebeer Route
	app.route('/ratebeer/:beerId')
    .get(users.requiresLogin, ratebeer.hasAuthorization, ratebeer.get);

	// Finish by binding the Beer middleware
	app.param('beerId', ratebeer.beerByID);
};
