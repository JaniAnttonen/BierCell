'use strict';

var beers = angular.module('beers', []);

/* A service to connect to ratebeer-api node module.
   Returns Ratebeer.com data which is then used in the UI. */
beers.service('RatebeerAPI',function() {
    var _this = this,
        rb = require('ratebeer-api');

    /* Search for a brewery with Beer.brewery data */
    this.searchBrewery = function(){
      rb.beerSearch(this.brewery, function(beers) {
        return beers;
      });
    }

    /* Search for a beer */
    this.searchBeer = function() {
      rb.beerSearch(this.name, function(beers)) {
        return beers;
      }
    }
});
