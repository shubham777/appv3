/**
 * Created by Shubham on 11-05-2015.
 */
'use strict'

var admin = angular.module('myApp.admin',['adminControllers', 'adminServices', 'ngRoute']);
admin.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/product',{
            templateUrl : 'product/product.html',
            controller : 'productController'
        })
        .when('/category', {
            templateUrl : 'category/category.html',
            controller : 'categoryController'
        })
        .when('/vendor', {
            templateUrl : 'vendor/vendor.html',
            controller : 'vendorController'
        })
        .when('/edit_product', {
            templateUrl : 'edit_product/edit_product.html',
            controller : 'editController'
        })
        .when('/edit_selected_product/:productCode', {
            templateUrl : 'edit_selected_product/edit_selected_product.html',
            controller : 'editSelectedProductController'
        })
        .otherwise({
            redirectTo : 'product'
        });
}]);
