/**
 * Created by Shubham on 18-05-2015.
 */

var storeControllers = angular.module('storeControllers',[]);
storeControllers.controller('productController', ['$scope', function($scope){

    $scope.product={};
    $scope.fileObj = null;
    $scope.ratings = [{name: '--Please select rating--'}, {name: 0},{name: 1}, {name: 2}, {name: 3},{name: 4},{name: 5}];
    $scope.statuses = [{name : 'Active', id : true},{ name : 'Inactive', id : false}];
    $scope.product.status = $scope.statuses[0];
    $scope.product.rating = $scope.ratings[0];
    $scope.categories = [{name : '-Category-', id : -1},{name : 'Furniture', id : 1}, {name  : 'Vehicles', id : 2}, {name  : 'Apparels', id : 3}];
    $scope.product.category = $scope.categories[0];
    $scope.durations = [{name : '-Duration-', id : -1},{name : 'Daily', id : 1},{name : 'Weekly', id : 2},{name : 'Monthly', id : 3}];
    $scope.product.duration = $scope.durations[0];
    var subCats = {};
    subCats['Furniture'] = [{name : 'Beds', id : 11},{name : 'Tables', id : 12},{name : 'Chairs', id : 13}, {name : 'Sofas', id : 14},{name : 'Wardrobes', id : 15}];
    subCats['Vehicles'] = [{name : 'Cars', id : 21},{name : 'Bikes', id : 22},{name : 'Bicycles', id : 23}, {name : 'Scooters', id : 24}];
    subCats['Apparels'] = [{name : 'Formal Wear', id : 31},{name : 'Sherwani', id : 32},{name : 'Costumes', id : 33}];
    $scope.subCategories = subCats[$scope.product.category.name];
    $scope.vendors = [{name : '-Vendor-', id : -1}];
    $scope.product.vendor = $scope.vendors[0];

    $scope.change = function() {
        $scope.subCategories = subCats[$scope.product.category.name];
    };



    $scope.addProduct = function(){


        try {
            var Product = Parse.Object.extend('Product');
            var product = new Product();
            product.set("name", $scope.product.name);
            product.set("rent", parseInt($scope.product.rent));
            product.set("duration", $scope.product.duration.id);
            product.set("security_deposit", parseInt($scope.product.securityDeposit));
            product.set("description", $scope.product.description);
            product.set("additional_information", $scope.product.additional_information);
            product.set("shipping_returns_description", $scope.product.shipping_returns);
            product.set("category_id", $scope.product.subCategory.id);
            product.set("parent_category_id", $scope.product.category.id);
            product.set("actual_price", parseInt($scope.product.actualPrice));
            product.set("vendor_id", localStorage.getItem('currentUserEmail'));
            product.set("rating", $scope.product.rating.name);
            product.set("status", $scope.product.status.id);
            product.set("vendor_type", 2);
            product.set("image_url_1", '/img/default_image.gif');
            product.set("image_url_2", '/img/default_image.gif');
            product.set("image_url_3", '/img/default_image.gif');
            product.save(null, {
                success: function (product) {
                    $scope.product.code = product.id.toUpperCase();
                    product.set("code", $scope.product.code);
                    product.save();
                    alert('Successfully added Product : ' + product.id);
                    console.log(product);
                    $('#productAdd').hide();
                    $('#imagesAdd').show();
                    $('#updateProductCode').click();
                },
                error: function (error) {
                    alert("Error");
                    console.log(error.code + ' ' + error.message);
                }
            });
        }
        catch(e){
            console.log("Exception : " + e.message);
        }

    };
    $scope.imageForm = {};


    $scope.skip = function(){
        window.location.href = '/pages/product_added.html';
    };

    $scope.validateUpdation = function(){
        debugger;
        if($('#productName').val() == ''){
            return true;
        }
        else if($('#productCode').val() == ''){
            return true;
        }
        else if($('#productPic').val().length == 0){
            return true;
        }
        else{
            return false;
        }
    };
    $scope.updateProductCode = function(){
        $('#productCode').val($scope.product.code);
    };

    $scope.clearProductFields = function(){
        $scope.product.name = "";
        $scope.product.rent = "";
        $scope.product.duration = $scope.durations[0];
        $scope.product.securityDeposit = "";
        $scope.product.description = "";
        $scope.product.additional_information = "";
        $scope.product.shipping_returns = "";
        $scope.product.subCategory.id = -1;
        $scope.product.category = $scope.categories[0];
        $scope.product.actualPrice = "";
        $scope.product.vendor = $scope.vendors[0];
        $scope.product.rating = $scope.ratings[0];
        $scope.product.status = $scope.statuses[0];
    };

    $scope.updateProductCodeField = function(){
        var x =   parseInt($scope.lastProductCode.substr(7));
        ++x;
        $scope.product.code = $scope.lastProductCode.slice(0,7) + String(x);
        $scope.$apply();
    };



    $('#profilePic').change(function(evt){
        console.log(evt);
        $scope.fileObj = evt.target.files[0];
        $scope.product.imageName = $(this).val().split(/(\\|\/)/g).pop();
        alert($scope.product.imageName);
    });

}]);
