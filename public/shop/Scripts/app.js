'use strict';


var app = angular.module('myApp.shop',['ngRoute','shopCtrl','shopServices','shopAnimations']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/browse',{
            templateUrl : 'browse/browse.html',
            controller : 'browseCtrl'
        })
        .when('/product/:productId', {
            templateUrl : 'product/product.html',
            controller : 'productCtrl'
        })
        .when('/test', {
            templateUrl : 'test/test.html'

        })
        .otherwise({
            redirectTo : '/browse'
        });
}]);