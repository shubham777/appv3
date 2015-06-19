/**
 * Created by Shubham on 23-05-2015.
 */
'use strict'

var shopDirectives = angular.module('shopDirectives', []);

shopDirectives.directive('starRating', function () {
    return {
        scope : {
            rating : '=',
            maxRating : '@',
            click : '&',
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'EA',
        template:
            "<div style='display: inline-block; margin: 0px; padding: 0px; cursor:pointer' ng-repeat='idx in maxRatings track by $index'> \
                <img ng-src='{{(hoverValue + _rating <= $index) &&  \"/img/Images/star-empty-lg.png\" || \"/img/Images/star-fill-lg.png\"}}' \
                ng-Click='isolatedClick($index + 1)' \ ng-mouseenter='isolatedMouseHover($index + 1)' \
                    ng-mouseleave='isolatedMouseLeave($index + 1)'>  \
            </div>",
        controller: function ($scope) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            }
            $scope._rating = $scope.rating;

            $scope.isolatedClick = function (param) {
                $scope.rating = $scope._rating = param;
                $scope.hoverValue = 0;
                $scope.click({
                    param: param
                }); //calling click function on the parent scope
            };

            $scope.isolatedMouseHover = function (param) {
                $scope._rating = 0;
                $scope.hoverValue = param;
                $scope.mouseHover({
                    param: param
                });
            };

            $scope.isolatedMouseLeave = function (param) {
                $scope._rating = $scope.rating;
                $scope.hoverValue = 0;
                $scope.mouseLeave({
                    param: param
                });
            };
        }
    };
});
