'use strict';

// Beers controller
angular.module('beers').controller('BeersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Beers',
	function($scope, $stateParams, $location, Authentication, Beers) {
		$scope.authentication = Authentication;

		// Create new Beer
		$scope.create = function() {
			// Create new Beer object
			var beer = new Beers ({
				name: this.name
			});

			// Redirect after save
			beer.$save(function(response) {
				$location.path('beers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Beer
		$scope.remove = function(beer) {
			if ( beer ) { 
				beer.$remove();

				for (var i in $scope.beers) {
					if ($scope.beers [i] === beer) {
						$scope.beers.splice(i, 1);
					}
				}
			} else {
				$scope.beer.$remove(function() {
					$location.path('beers');
				});
			}
		};

		// Update existing Beer
		$scope.update = function() {
			var beer = $scope.beer;

			beer.$update(function() {
				$location.path('beers/' + beer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Beers
		$scope.find = function() {
			$scope.beers = Beers.query();
		};

		// Find existing Beer
		$scope.findOne = function() {
			$scope.beer = Beers.get({ 
				beerId: $stateParams.beerId
			});
		};
	}
]);