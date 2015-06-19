

'use strict'
var adminControllers = angular.module('adminControllers', ['adminServices']);
adminControllers.controller('navbarController', ['$scope', function($scope){

    $scope.logOut = function(){
        localStorage.clear();
        window.location.reload();
    };
}]);
adminControllers.controller('productController', ['$scope', function($scope){

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
    ($scope.getVendors = function(){
        var Vendor = Parse.Object.extend('Vendor');
        var query = new Parse.Query(Vendor);
        query.find({
           success : function(vendors){
               console.log(vendors);
               $scope.updateVendors(vendors);
           },
           error :  function(err){
            console.log(err.code + ' ' + err.message);
           }
        });
    })();

    $scope.updateVendors = function(vendors){
        var vendor_list = [];
        var vendor = {};
        for(var i=0; i< vendors.length; i++){
            vendor.id =  vendors[i].id;
            vendor.name = vendors[i]._serverData.name;
            vendor_list.push(vendor);
            vendor = {};
        }
        $scope.vendors = vendor_list;
        console.log(vendor_list);
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
            product.set("vendor_id", $scope.product.vendor.id);
            product.set("rating", $scope.product.rating.name);
            product.set("status", $scope.product.status.id);
            product.set("vendor_type", 1);
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

    $scope.check = function(){

        console.log($('#productName').val());
        console.log($('#productCode').val());
        console.log($('#productPic').val());
        console.log()


    };
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

       $scope.uploadProfilePhoto = function(){ debugger;
        var profilePicControl = $('#inputFileToLoad')[0];
        var i = 0;
        if(profilePicControl.files.length > 0 && profilePicControl.files.length < 4 ) {

            while (i < 4) {
                var file = profilePicControl.files[0];
                var name = file.name;
                var parseFile = new Parse.File(name, file);
                parseFile.save().then(function (parseFile) {
                        var profilePicUrl = parseFile.url();
                        console.log(parseFile);
                    },
                    function error(error) {
                        alert('Error saving product Pic file! '+ i + error.code + " " + error.message);
                    });
                i++;
            }
        }
    };

    $('#profilePic').change(function(evt){
        console.log(evt);
        $scope.fileObj = evt.target.files[0];
       $scope.product.imageName = $(this).val().split(/(\\|\/)/g).pop();
        alert($scope.product.imageName);
    });

}]);
adminControllers.controller('categoryController', ['$scope', function($scope){

    $scope.category = {};

    $scope.statuses = [{name : 'Active', id : 1},{ name : 'Inactive', id : 0}];
    $scope.categories = [{name : '--Please Select Parent Category--', id : -1},{name : 'None', id : 0},{name : 'Furniture', id : 1},{name : 'Electronics', id : 2}, {name : 'Apparels', id :3}, {name : 'Vehicles', id : 4},
                         { name : 'Adventure Gear', id : 5}];
    $scope.category.parent = $scope.categories[0];
    $scope.category.status = $scope.statuses[0];

    $scope.addCategory = function(){

        var Category = Parse.Object.extend('Category');
        var category = new Category();
        category.save({
            category_id : parseInt($scope.category.id),
            name : $scope.category.name,
            parent_id : parseInt($scope.category.parent.id),
            description : $scope.category.description,
            status : parseInt($scope.category.status.id)
        },{
            success :  function(category){
                alert("Category Created " + category.id);
            },
            error : function(category, error){
                alert('Failed to create Category!! ' + error.id + "" + error.message);
            }
        });


    };


}]);


adminControllers.controller('vendorController', ['$scope', function($scope){

    $scope.vendor = {};
    $scope.vendor.country = "India";
    $scope.states = [{name : '--Please Select Your State--'},{name : 'Andaman', id: 1},{name : 'Karnataka', id : 2},{name :'Uttar Pradesh', id : 3}];
    $scope.vendor.state = $scope.states[0];
    $scope.validateUpdation = function(){
        debugger;
        if(typeof $scope.vendor.name === 'undefined' || $scope.vendor.name == ''){
            return true;
        }
        else if($scope.vendor.email == '' || typeof $scope.vendor.email === 'undefined'){
            return true;
        }
        else if($scope.vendor.phone1 == '' || typeof $scope.vendor.phone1 === 'undefined'){
            return true;
        }
        else if($scope.vendor.address == '' || typeof $scope.vendor.address === 'undefined'){
            return true;
        }
        else if($scope.vendor.city == '' || typeof $scope.vendor.city === 'undefined'){
            return true;
        }
        else if($scope.vendor.pincode == '' || typeof $scope.vendor.pincode === 'undefined'){
            return true;
        }
        else if(typeof $scope.vendor.state != 'undefined' ) {
            if($scope.vendor.state.name === '--Please Select Your State--' || $scope.vendor.state.name == '')
                return true;
        }

        else{
            return false;
        }


    };

    $scope.addVendor = function(){


        var Vendor = Parse.Object.extend('Vendor');
        var vendor = new Vendor();
        vendor.set("name", $scope.vendor.name);
        vendor.set("email", $scope.vendor.email);
        vendor.set("phone1", $scope.vendor.phone1);
        vendor.set("phone2", $scope.vendor.phone2);
        vendor.set("address", $scope.vendor.address);
        vendor.set("state", $scope.vendor.state.name);
        vendor.set("city", $scope.vendor.city);
        vendor.set("pincode", $scope.vendor.pincode);
        vendor.save(null, {
           success :  function(vendor){
               console.log("Success : "  + vendor);
               $('#thankYouModal').modal('show');
           } ,
           error :  function(err, vendor){
               console.log(err);
           }
        });
    }
}]);

adminControllers.controller("editController",['$scope','$http', function($scope, $http){
    $scope.allProducts = [];
    $scope.products = [];
    $scope.noOfVisibleProducts = 12;


    ($scope.getProds = function(){
        $('#spinner').show();

        $http.get('/api/getAllProducts')
            .success(function(data){
                $scope.allProducts = data;
                console.log($scope.allProducts);
                $scope.updateProducts(0,$scope.noOfVisibleProducts);
                $('#spinner').hide();
            })
            .error(function(data){

            });

    })();
    $scope.updateProducts = function(first,last){
        for(var i=first; i< last; i++){
            $scope.products[i] = $scope.allProducts[i];
        }
        localStorage.setItem("f",first);
        localStorage.setItem("l", last);
        for(var i =0; i< $scope.products.length; i++){
            $scope.products[i].parent_category = $scope.updateParentCategory($scope.products[i].parent_category_id);
        }
        $('#bottom').show();
    };
    $scope.timer = function(){
      for(var i =0; i< 10000; i++){
          for(var j=0;j<10000;j++){}
      }
    };
    $scope.next = function(){

        if(parseInt(localStorage.getItem("l")) == $scope.allProducts.length){
            return;
        }
        var first = parseInt(localStorage.getItem("f")) + 12;
        if($scope.allProducts.length - first >= 12 ){
            var last = first + 12;
        }
        else{
            var last = $scope.allProducts.length;
        }
        $scope.products = [];
        for(var i=first,j=0; i< last; i++,j++){
            $scope.products[j] = $scope.allProducts[i];
        }
        localStorage.setItem("f", first);
        localStorage.setItem("l", last);
        // $scope.$apply();


    };
    $scope.edit = function(code){

    };
    $scope.prev = function(){

        if(parseInt(localStorage.getItem("f")) == 0){
            return;
        }
        var first = parseInt(localStorage.getItem("f"));
        var last = parseInt(localStorage.getItem("l"));
        if(first > 0 && last-first == 12){
            first = first - 12;
             last = parseInt(localStorage.getItem("l")) -12;
        }
        else{

             last = $scope.allProducts.length - (last-first);
            first = first - 12;
        }
        $scope.products = [];
        for(var i=first,j=0; i< last; i++,j++){
            $scope.products[j] = $scope.allProducts[i];
        }
        localStorage.setItem("f", first);
        localStorage.setItem("l", last);

    };

    $scope.updateParentCategory = function(category_id){
        var category = "";
        switch(category_id){
            case 1 : category = "Furniture";
                break;
            case 2 : category = "Vehicles";
                break;
            case 3 : category = "Apparels";
                break;
            case 4 : category = "Electronics";
                break;
            case 5 : category = "Adventure";
                break;
            default : return '';
        }
        return category;
    };

    $scope.updateSubCategory = function(category_id, subCategory_id){
        var subCatId = parseInt(String(subCategory_id).substr(1)) - 1 ;
        if(category_id === 1){
            return $scope.allSubCategories[0].Furniture[subCatId];
        }
        else if(category_id === 2){
            $scope.subCategories = $scope.allSubCategories[1].Vehicles[subCatId];
        }
        else if(category_id === 3){
            $scope.subCategories = $scope.allSubCategories[2].Apparels[subCatId];
        }
        else if(category_id === 4){
            $scope.subCategories = $scope.allSubCategories[3].Electronics[subCatId];
        }
        else if(category_id === 5){
            $scope.subCategories = $scope.allSubCategories[4].Adventure[subCatId];
        }
        else {}
    };


    $scope.categories = [
        {'name' : 'Furniture'},
        {'name' : 'Vehicles'},
        {'name' : 'Apparels'},
        {'name' : 'Electronics'},
        {'name' : 'Adventure'}
    ];
    $scope.allSubCategories = [{ 'Furniture' : ['Beds','Tables','Chairs', 'Sofas', 'Bean Bags']},
        { 'Vehicles' : ['Bikes', 'Cars', 'Scooters','Bicycles']},
        { 'Apparels' : ['Formal Wear', 'Sherwani' , 'Costumes']},
        { 'Electronics' : ['AC & Coolers', 'Refigerators','TVs','Microwave']},
        { 'Adventure' : ['Camping', 'Trekking', 'Tents']}
    ];
}]);

adminControllers.controller('editSelectedProductController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){

   $scope.productCode = $routeParams.productCode;
    $scope.categories = [
        {name : '-Category-', id : -1},
        {'name' : 'Furniture', id : 1},
        {'name' : 'Vehicles', id : 2},
        {'name' : 'Apparels', id : 3},
        {'name' : 'Electronics', id : 4},
        {'name' : 'Adventure', id : 5}
    ];
    $scope.allSubCategories = [{ 'Furniture' : [{name :'Beds', id : 11},{name :'Tables', id : 12},{name : 'Chairs', id :13}, {name : 'Sofas',id : 14}, {name :'Bean Bags', id : 15}]},
        { 'Vehicles' : [{name :'Bikes', id : 21}, {name :'Cars', id : 22}, {name :'Scooters', id : 23},{name :'Bicycles', id :24}]},
        { 'Apparels' : [{name :'Formal Wear', id : 31}, {name :'Sherwani', id : 32} , {name :'Costumes', id :33}]},
        { 'Electronics' : [{name :'AC & Coolers', id :41}, {name : 'Refigerators', id : 42},{name :'TVs', id :43},{name :'Microwave', id :44}]},
        { 'Adventure' : [{name :'Camping', id : 51}, {name :'Trekking', id : 52}, {name :'Tents', id : 53}]}
    ];
    $scope.ratings = [{name: '--Please select rating--', value : -1}, {name: '0', value : 0},{name: '1', value : 1}, {name: '2', value : 2}, {name: '3', value : 3},{name: '4', value : 4},{name: '5', value : 5}];
    $scope.statuses = [{name : 'Active', id : true},{ name : 'Inactive', id : false}];
  //  $scope.categories = [{name : '-Category-', id : -1},{name : 'Furniture', id : 1}, {name  : 'Vehicles', id : 2}, {name  : 'Apparels', id : 3}];
    $scope.durations = [{name : '-Duration-', id : -1},{name : 'Daily', id : 1},{name : 'Weekly', id : 2},{name : 'Monthly', id : 3}];
    $scope.subCategories = [];
   $scope.product = {};
   $http.get('/api/getProduct/' + $scope.productCode)
       .success(function(data){
           $scope.resultProduct = data;
           if(typeof $scope.resultProduct  != undefined){
               $scope.productExisting = true;
           }
           else {
               $scope.productExisting = false;
           }
           console.log($scope.resultProduct);
           $scope.updatePage($scope.resultProduct);
       })
       .error(function(error){

       });

    $scope.updatePage = function(data){
        $scope.product.code = data.code;
        $scope.product.name = data.name;
        $scope.product.rent = data.rent;
        $scope.product.securityDeposit = data.security_deposit;
        $scope.product.actualPrice = data.actual_price;
        $scope.product.description = data.description;
        $scope.product.additionalInformation = data.additional_information;
        $scope.product.shippingReturns = data.shipping_returns_description;
        $scope.product.vendorId = data.vendor_id;
        $scope.product.vendorType = data.vendor_type;
        $scope.product.category = $scope.categories.filter(function(el){
            return el.id == data.parent_category_id
        })[0];
        $scope.product.subCategory = $scope.updateSubCategory(data.parent_category_id, data.category_id);
        $scope.product.duration = $scope.durations.filter(function(el){
           return el.id == data.duration
        })[0];
        $scope.product.status = $scope.statuses.filter(function(el){
            return el.id == data.status
        })[0];
        $scope.product.rating = $scope.ratings.filter(function(el){
            return el.value == data.rating
        })[0];


    };
    $scope.updateParentCategory = function(category_id){
        var category = "";
        switch(category_id){
            case 1 : category = "Furniture";
                break;
            case 2 : category = "Vehicles";
                break;
            case 3 : category = "Apparels";
                break;
            case 4 : category = "Electronics";
                break;
            case 5 : category = "Adventure";
                break;
            default : return '';
        }
        return category;
    };

    $scope.updateSubCategory = function(category_id, subCategory_id){
        debugger;
        var subCatId = parseInt(String(subCategory_id).substr(1)) - 1 ;
        if(category_id === 1){
            $scope.subCategories =  $scope.allSubCategories[0].Furniture;
        }
        else if(category_id === 2){
            $scope.subCategories = $scope.allSubCategories[1].Vehicles;
        }
        else if(category_id === 3){
            $scope.subCategories = $scope.allSubCategories[2].Apparels;
        }
        else if(category_id === 4){
            $scope.subCategories = $scope.allSubCategories[3].Electronics;
        }
        else if(category_id === 5){
            $scope.subCategories = $scope.allSubCategories[4].Adventure;
        }
        else {}
        return $scope.subCategories.filter(function(el){
           return el.id == subCategory_id
        })[0];
    };

    $scope.editProduct = function(){

        try {
            var Product = Parse.Object.extend('Product');
            var query = new Parse.Query(Product);
                query.equalTo("code", $scope.product.code);
                query.first({
                   success :  function(product){
                       product.set("name", $scope.product.name);
                       product.set("rent", parseInt($scope.product.rent));
                       product.set("duration", $scope.product.duration.id);
                       product.set("security_deposit", parseInt($scope.product.securityDeposit));
                       product.set("description", $scope.product.description);
                       product.set("additional_information", $scope.product.additionalInformation);
                       product.set("shipping_returns_description", $scope.product.shippingReturns);
                       product.set("actual_price", parseInt($scope.product.actualPrice));
                       product.set("rating", $scope.product.rating.value);
                       product.set("status", $scope.product.status.id);
                       product.save(null, {
                           success: function (product) {
                               alert('Successfully edited Product : ' + product.id);
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
                   },
                    error :  function(error, product){

                    }
                });
            var product = new Product();

        }
        catch(e){
            console.log("Exception : " + e.message);
        }
    };

    $scope.updateProductCode = function(){
        $('#productCode').val($scope.product.code);
        $('#productName').val($scope.product.name);
    };
    $scope.skip = function(){
        window.location.href = '/pages/product_added.html';
    };
}]);