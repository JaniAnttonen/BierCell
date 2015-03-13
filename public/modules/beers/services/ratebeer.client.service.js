'use strict';

/* A service to connect to ratebeer-api node module.
   Returns Ratebeer.com data which is then used in the UI. */
angular.module('beers').factory('RateBeer', ['$resource',
	function($resource) {
		return $resource('ratebeer/:beerId', { beerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
