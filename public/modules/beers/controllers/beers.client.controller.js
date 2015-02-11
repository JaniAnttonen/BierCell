'use strict';

// Beers controller
angular.module('beers').controller('BeersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Beers', 'Preferences',
	function($scope, $stateParams, $location, Authentication, Beers, Preferences) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		$scope.preferences = Preferences;

		// Create new Beer
		$scope.create = function() {
			// Create new Beer object
			var beer = new Beers ({
				name: this.name,
		        brewery: this.brewery,
		        bestBefore: this.bestBefore,
		        quantity: this.quantity,
		        price: this.price
			});

			// Redirect after save
			beer.$save(function(response) {
				$location.path('/');

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
				$location.path('beers');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Increment quantity
		$scope.incrementBeer = function() {
			var beer = $scope.beer;
				this.beer.quantity += 1;
				this.beer.$update();
		};

		// Subtract a beer
		$scope.subtractBeer = function() {
			var beer = $scope.beer;
			if (this.beer.quantity>0)
				this.beer.quantity -= 1;
			else {
				this.beer.$remove();
        $location.path('/beers');
			}
			this.beer.$update();
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

    // "Sort by" buttons in the list view
    $scope.buttons = [{'param':'quantity',title:'Quantity'},
                      {'param':'price',title:'Price'},
                      {'param':'bestBefore',title:'Best Before'},
                      {'param':'name',title:'Alphabetic'}];

    $scope.order = function(orderBy) {
    	var preferences = $scope.preferences;
    	preferences.order = orderBy;
    };

  }
]);
