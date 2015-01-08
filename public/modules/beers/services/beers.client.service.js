'use strict';

//Beers service used to communicate Beers REST endpoints
angular.module('beers').factory('Beers', ['$resource',
	function($resource) {
		return $resource('beers/:beerId', { beerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);