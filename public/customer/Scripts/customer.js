/**
 * Created by Shubham on 04-05-2015.
 */

var customer = angular.module('myApp.customer',['customerControllers', 'customerServices','myApp.customer.store', 'ngRoute']);
customer.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/orders',{
            templateUrl : 'orders/orders.html',
            controller : 'ordersController'
        })
        .when('/profile', {
            templateUrl : 'profile/profile.html',
            controller : 'profileController'
        })
        .when('/store',{
            templateUrl : 'store/store.html',
            controller : 'storeController'
        })
        .when('/edit_product', {
            templateUrl : 'edit_product/edit_product.html',
            controller : 'editController'
        })
        .when('/edit_selected_product/:productCode', {
            templateUrl : 'edit_selected_product/edit_selected_product.html',
            controller : 'editSelectedProductController'
        })
        .when('/messages',{
            templateUrl : 'messages/messages.html',
            controller : 'messagesCtrl'

        })
        .when('/notifications',{
            templateUrl : 'notifications/notifications.html',
            controller : 'notificationsCtrl'

        })
        .otherwise({
            redirectTo : 'orders'
        });
}]);

