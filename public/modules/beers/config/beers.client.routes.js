'use strict';

//Setting up route
angular.module('beers').config(['$stateProvider',
	function($stateProvider) {
		// Beers state routing
		$stateProvider.
		state('listBeers', {
			url: '/beers',
			templateUrl: 'modules/beers/views/list-beers.client.view.html'
		}).
		state('createBeer', {
			url: '/beers/create',
			templateUrl: 'modules/beers/views/create-beer.client.view.html'
		}).
		state('viewBeer', {
			url: '/beers/:beerId',
			templateUrl: 'modules/beers/views/view-beer.client.view.html'
		}).
		state('editBeer', {
			url: '/beers/:beerId/edit',
			templateUrl: 'modules/beers/views/edit-beer.client.view.html'
		});
	}
]);