/**
 * Create Shop Controller module
 */
'use strict'

var shopCtrl = angular.module('shopCtrl', ['shopServices','shopDirectives']);

shopCtrl.controller('browseCtrl',['$scope', '$http', function($scope, $http){

    $scope.orderCriteria = 'age';
    $scope.noOfVisibleProducts = 12;
    //var data = Products.getAllProducts();
    $scope.products = [];
    console.log($scope.products);
    $scope.defaultCategory = true;
    $scope.maxRating = 5;
    $scope.getNumber = function(num) {
        var arr = [];
        for(var i=0; i< num; i++){
            arr.push(i);
        }
        return arr;
    };
    $scope.allProducts = [];

    ($scope.getProds = function(){
        $('#spinner').show();

        $http.get('/api/getAllProducts')
            .success(function(data){
                $scope.allProducts = data;
                console.log($scope.allProducts);
                $scope.updateProductsButton();
            })
            .error(function(data){

            });

    })();
    $scope.updateProductsButton = function(){
        $('#spinner').hide();
        $scope.products = $scope.allProducts;
        for(var i =0; i< $scope.products.length; i++){
            $scope.products[i].parent_category = $scope.updateParentCategory($scope.products[i].parent_category_id);
        }
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

    $scope.categoryGroup = [{name : 'Furniture', on: true},
        {name : 'Vehicles', on: true},
        {name : 'Apparels', on: true},
        {name : 'Adventure', on: true},
        {name :  'Electronics', on: true }
    ];

    $scope.localityGroup = [{name : 'Koramangala', on: true},
        {name : 'Indiranagar', on: true},
        {name : 'Ejipura', on: true},
        {name : 'Shivajinagar', on: true},
        {name :  'HSR Layout', on: true },
        {name :  'BTM Layout', on: true }
    ];

    $scope.priceRangeGroup = [{name : 'Below and 250', on: true},
        {name : '250 - 500', on: true},
        {name : '500 and Above', on: true}

    ];
    $scope.filterCategory = function(arr){

        for(var i in $scope.categoryGroup){
            var category = $scope.categoryGroup[i]
            if(category.on && arr.parent_category == category.name){
                return true;
            }
        }
    };

    $scope.filterPriceRange = function(arr){

        for(var i in $scope.priceRangeGroup){
            var priceRange = $scope.priceRangeGroup[i];
            if(priceRange.on && arr.rent > 0 && arr.rent <= 250 && priceRange.name == 'Below and 250' ){
                return true;
            }
            if(priceRange.on && arr.rent > 250 && arr.rent < 500 && priceRange.name == '250 - 500' ) {
               return true;
            }
            if(priceRange.on && arr.rent >= 500 &&  priceRange.name == '500 and Above' ) {
                return true;
            }


        }
    };


    $scope.filterLocality = function(arr){

        for(var i in $scope.localityGroup){
            var locality = $scope.localityGroup[i]
            if(locality.on && arr.locality == locality.name){
                return true;
            }
        }
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
    $scope.subCategories = [];

    $scope.changeSubCategory = function(category){
        debugger;
        if(category === "Furniture"){
            $scope.subCategories = $scope.allSubCategories[0].Furniture;
        }
        else if(category === "Vehicles"){
            $scope.subCategories = $scope.allSubCategories[1].Vehicles;
        }
        else if(category === "Apparels"){
            $scope.subCategories = $scope.allSubCategories[2].Apparels;
        }
        else if(category === "Electronics"){
            $scope.subCategories = $scope.allSubCategories[3].Electronics;
        }

        else if(category === "Adventure"){
            $scope.subCategories = $scope.allSubCategories[4].Adventure;
        }
        else {}

    };


}]);


shopCtrl.controller('loginCtrl', ['$scope', '$http', function($scope, $http){



    $scope.signUp =  function(){

        var user = {
            username : $scope.emailSignUp,
            password : $scope.passwordSignUp,
            name : $scope.nameSignUp,
            mobile : $scope.mobileSignUp,
            email : $scope.emailSignUp
        };

        $http.post('/api/signUp', user)
            .success(function(data, status, headers, config){
                alert("You are good to go!");
                console.log(data);
                $scope.setCurrentUser(data);
                var email = {
                    recipient_email : data.email,
                    user_name : data.name,
                    subject : "Welcome to Rentbingo"
                };
                $scope.sendEmail(email);
               // location.reload();
            })
            .error(function(error){
                alert("Error: " +  error.message);
                //202username faraz@yahoo.com already taken
            });


        /*
        debugger;
        var user = new Parse.User();
        user.set("username", $scope.emailSignUp);
        user.set("password",$scope.passwordSignUp);
        user.set("name",$scope.nameSignUp);
        user.set("mobile",$scope.mobileSignUp);
        user.set("email",$scope.emailSignUp);

        user.signUp(null, {
            success : function(user){
                alert("success");
               location.reload();

            },
            error : function(user, error){
                alert("Error: " +  error.message);
                //202username faraz@yahoo.com already taken
            }
        }); */
    };

    $scope.setCurrentUser = function(user){
        localStorage.setItem('currentUserName', user.name );
        localStorage.setItem('currentUserEmail', user.email );
        localStorage.setItem('currentUserMobile', user.mobile );

    };

    $scope.freeLocalStorage = function(){
      localStorage.clear();
    };
   $scope.facebookSignUp = function(){


       Parse.FacebookUtils.logIn(null, {
           success: function(user) {
               if (!user.existed()) {
                   alert("User signed up and logged in through Facebook!");
               } else {
                   alert("User logged in through Facebook!");
               }
           },
           error: function(user, error) {
               alert("User cancelled the Facebook login or did not fully authorize.");
           }
       });
   };

    $scope.signIn = function(){
        debugger;

        var user = {
            username : $scope.emailSignIn,
            password : $scope.passwordSignIn
        };

        $http.post('/api/signIn', user)
            .success(function(data, headers, status, config){
                if(typeof data.code != 'undefined'){
                    $scope.showError(data);
                }
                else {
                    $('#menu_item_MyAccount').show();
                    $('#login').hide();
                    $('#loginModal').modal('hide');
                    $scope.setCurrentUser(data);
                   if(data.name == "admin"){
                        window.open('/admin');
                        return;
                    }
                    window.location.reload();

                }
            })
            .error(function(error, status){
                alert("Error: " + error.code + error.message);
            });

        /*
        if($scope.emailSignIn == 'admin@rentbingo.com' && $scope.passwordSignIn == 'admin123'){
            window.open('/app/admin');
            return;
        }

        $('#spinner').show();
        setTimeout(function(){
            $('#spinner').hide();
            $('#menu_item_MyAccount').hide();
            $('#login').show();
        }, 1500);

        Parse.User.logIn($scope.emailSignIn, $scope.passwordSignIn,{

           success : function(user) {
               $('#menu_item_MyAccount').show();
               $('#login').hide();
               $('#loginModal').modal('hide');
               window.location.reload();

           } ,
            error : function(user, error){

            }
        });
        */
    };

    $scope.resetPassword = function(){

        var user = {
          username :  $scope.emailResetPassword
        };

        $http.post('/api/resetPassword', user)
            .success(function(data, status, headers, config){

                alert('Please check your email to reset password');
                $('#loginModal').modal('hide');
            })
            .error(function(error){
                alert("Error: " + error.code + " " + error.message);
            })
        /*
        Parse.User.requestPasswordReset($scope.emailResetPassword, {
            success: function() {
                // Password reset request was sent successfully
                alert('success');
            },
            error: function(error) {
                // Show the error message somewhere
                alert("Error: " + error.code + " " + error.message);
            }
        });
        */
    };

    $scope.logOut = function(){
        if(typeof Parse.User.current()){
            Parse.User.logOut();
        }
        $scope.freeLocalStorage();
        $('#spinner').show();
        setTimeout(function(){
        $('#spinner').hide();
            $('#menu_item_MyAccount').hide();
            $('#login').show();
        }, 1500);

        var user = {
            username :  $scope.currentUserEmail
        };

        $http.post('/api/logOut', user)
            .success(function(data, status, headers, config){
            })
            .error(function(error){
            });


    };
    $scope.showError = function(error){
      alert("Error : " + error.message);
    };

    $scope.sendEmail = function(email){

        $http.post('/api/sendEmail', email)
            .success(function(data){
                    console.log("Email data : " + data);
            })
            .error(function(error){

            });
    };

    $scope.currentUser = localStorage.getItem('currentUserName');
   // $scope.currentUserName = 'User';
    if($scope.currentUser) {
        $scope.currentUserName = localStorage.getItem('currentUserName');
        $scope.currentUserEmail = localStorage.getItem('currentUserEmail');
    }
}]);

shopCtrl.controller('productCtrl',['$scope','$routeParams','$http', function($scope, $routeParams, $http){

    if(typeof localStorage.getItem('rating') == 'string'){
        $scope.rating1 = parseInt(localStorage.getItem('rating'));
    }

    $scope.click = function(param){
        alert(param);
    };
    $scope.mouseHover = function (param) {
        $scope.hoverRating1 = param;
    };

    $scope.mouseLeave = function (param) {
        $scope.hoverRating1 = param + '*';
    };

    String.prototype.isNumber = function()
    {
        return /^\d+$/.test(this);
    }

    $scope.productId = $routeParams.productId;
    $scope.product = {};


    $scope.updatePage = function() {
        debugger;
        $scope.product.name = $scope.resultProduct.name;
        $scope.product.description = $scope.resultProduct.description;
        $scope.product.additionalInformation = $scope.resultProduct.additional_information;
        $scope.product.shippingReturns = $scope.resultProduct.shipping_returns_description;
        $scope.product.actualPrice = $scope.resultProduct.actual_price;
        $scope.product.securityDeposit = $scope.resultProduct.security_deposit;
        $scope.product.imageUrl_1 = $scope.resultProduct.image_url_1;
        $scope.product.imageUrl_2 = $scope.resultProduct.image_url_2;
        $scope.product.imageUrl_3 = $scope.resultProduct.image_url_3;
        $scope.product.mainImageUrl = $scope.resultProduct.image_url_1;
        $scope.product.parentCategoryId = $scope.resultProduct.parent_category_id;
        $scope.product.categoryId = $scope.resultProduct.category_id;
        $scope.rating1 = $scope.product.rating = $scope.resultProduct.rating;
        $scope.product.vendorId = $scope.resultProduct.vendor_id;
        $scope.product.rent = $scope.resultProduct.rent;
        $scope.findCategories( $scope.product.parentCategoryId, $scope.product.categoryId)
        localStorage.setItem('rating', $scope.rating1);


    };

    ($scope.getproductDetails = function(){

        $http.get('/api/getProduct/' + $scope.productId )
            .success(function(data){
                $scope.resultProduct = data;
                if(typeof $scope.resultProduct  != undefined){
                    $scope.productExisting = true;
                }
                else {
                    $scope.productExisting = false;
                }
                $scope.updatePage();
            })
            .error(function(error){

            });

        /*
    var Product = Parse.Object.extend('Product');
    var query = new Parse.Query(Product);
    query.equalTo("code", $scope.productId);
    query.find({
        success: function (results) {

            if(typeof results[0] != 'undefined') {
                $scope.productExisting = true;
               // alert('success product query');
                $scope.resultProduct = results[0]._serverData;
                console.log($scope.resultProduct);
                $('#updatePage').click();
            }
            else {
                alert('No such Product');
                $scope.productExisting = false;
            }
        },
        error: function (error) {
            alert("Error getting Product: " + error.code + " " + error.message);
        }

    }) */
    })();


    $scope.setImage = function(imageUrl){debugger;
        $scope.product.mainImageUrl = imageUrl;
    };

    $scope.categories = [
        {'name' : 'Furniture', id : 1},
        {'name' : 'Vehicles', id : 2},
        {'name' : 'Apparels', id : 3},
        {'name' : 'Electronics', id : 4},
        {'name' : 'Adventure', id :5}
    ];
    $scope.allSubCategories = [{ 'Furniture' : ['Beds','Tables','Chairs', 'Sofas', 'Bean Bags']},
        { 'Vehicles' : ['Bikes', 'Cars', 'Scooters']},
        { 'Apparels' : ['Formal Wear','Sherwani','Costumes']},
        { 'Electronics' : ['AC & Coolers', 'Refigerators','TVs','Microwave']},
        { 'Adventure' : ['Camping', 'Trekking', 'Tents']}
    ];

    $scope.findCategories = function(parent, sub){

        var strParentCatId = String(parent);
        var strSubCatId =  String(sub).substr(1);

        switch(parent){
            case 1 : $scope.product.categoryName = 'Furniture';
                     $scope.product.subCategoryName = $scope.allSubCategories[0].Furniture[parseInt(strSubCatId)-1];
                    break;
            case 2 : $scope.product.categoryName = 'Vehicles';
                     $scope.product.subCategoryName = $scope.allSubCategories[1].Vehicles[parseInt(strSubCatId)-1];
                     break;
            case 3 : $scope.product.categoryName = 'Apparels';
                $scope.product.subCategoryName = $scope.allSubCategories[2].Apparels[parseInt(strSubCatId)-1];
                break;
            case 4 : $scope.product.categoryName = 'Electronics';
                     $scope.product.subCategoryName = $scope.allSubCategories[3].Electronics[parseInt(strSubCatId)-1];
                     break;

            case 5 : $scope.product.categoryName = 'Adventure';
                     $scope.product.subCategoryName = $scope.allSubCategories[4].Adventure[parseInt(strSubCatId)-1];
                     break;
            default : return;
        }



    }

    $scope.message = {};


    $scope.messageOwner = function(){
        var vendor_type = $scope.resultProduct.vendor_type;

        if(typeof vendor_type != 'undefined'){
            var vendor_id = $scope.resultProduct.vendor_id;

            var Message = Parse.Object.extend('Message');
            var message = new Message();
            message.set("sender_name", $scope.message.name);
            message.set("sender_email", $scope.message.email);
            message.set("sender_mobile", $scope.message.mobile);
            message.set("sender_message", $scope.message.textMessage);
            message.set("vendor_id", vendor_id);
            message.set("product_code", $scope.productId);
            message.set("product_image_url", $scope.product.imageUrl_1);
            message.set("read_status", false);
            message.save(null, {
                success : function(message){
                    $('#messageModal').modal('hide');
                    alert('message sent' + message.id);
                    console.log('Message updated to db for ' + vendor_id);
                    $('#thankMessageModal').modal('show');
                } ,
                error :  function(message, error){
                    alert('Error : ' + error.id);
                    console.log('Error: updating message to db by ' + 'guest to ' + vendor_id + ' '  + error.code + error.message);
                }
            });

             if(vendor_type == 1){

               // alert(vendor_id +  '  ' + typeof parseInt(vendor_id));
             }
             else {

             }

        }
    };

    $scope.likeProduct = function(){
      var currentUser = Parse.User.current();
        var vendor_id = $scope.resultProduct.vendor_id;
        if(currentUser){

            (function(){
                var userDetails = currentUser._serverData;
                var Notification = Parse.Object.extend('Notification');
                var notify = new Notification();
                    notify.set("name", userDetails.name);
                    notify.set("email", userDetails.email);
                    notify.set("mobile", userDetails.mobile);
                    notify.set("vendor_id", vendor_id);
                    notify.set("product_code", $scope.productId);
                    notify.set("product_image_url", $scope.product.imageUrl_1);
                    notify.set("read_status", false);
                    notify.save(null, {
                        success : function(like){
                            alert('Product Liked' + like.id);
                            console.log('Like Notification updated to db for ' + vendor_id);
                            $('#likeThankModal').modal('show');
                        } ,
                        error :  function(notify, error){
                            alert('Error : ' + error.id);
                            console.log('Error: adding notification to db by ' + userDetails.username+' to ' + vendor_id + ' '  + error.code + error.message);
                        }
                    });
            })();

        }
        else{
            $('#loginModal').modal('show');
        }
    };



    $scope.validateMessageForm = function(){
        if(typeof $scope.message.name === 'undefined' || $scope.message.name == ''){
            return true;
        }
        else if($scope.message.email == '' || typeof $scope.message.email === 'undefined'){
            return true;
        }
        else if($scope.message.mobile == '' || typeof $scope.message.mobile === 'undefined'){
            return true;
        }
        else if($scope.message.textMessage == '' || typeof $scope.message.textMessage === 'undefined'){
            return true;
        }
        else {
            return false;
        }


    };

}]);

shopCtrl.controller('contactCtrl', ['$scope', function($scope){
    $scope.contact = {};


    $scope.validateContactForm = function(){
        if(typeof $scope.contact.name === 'undefined' || $scope.contact.name == ''){
            return true;
        }
        else if($scope.contact.email == '' || typeof $scope.contact.email === 'undefined'){
            return true;
        }
        else if($scope.contact.mobile == '' || typeof $scope.contact.mobile === 'undefined'){
            return true;
        }
        else if($scope.contact.message == '' || typeof $scope.contact.message === 'undefined'){
            return true;
        }
        else {
            return false;
        }


    }

    $scope.contactUs = function(){
        var Contact = Parse.Object.extend('Contact');
        var contact = new Contact();
        contact.set("sender_name", $scope.contact.name);
        contact.set("sender_email", $scope.contact.email);
        contact.set("sender_mobile", $scope.contact.mobile);
        contact.set("sender_message", $scope.contact.message);
        contact.save(null, {
            success : function(contact){
               // alert('Contact message sent' + contact.id);
                console.log('Contact message sent' + contact.id);
                $('#contactusModal').modal('hide');
                $('#thankContactModal').modal('show');
            } ,
            error :  function(contact, error){
                alert('Error : ' + error.id);
                console.log('Error: Sending Contact message ' +   + error.code + error.message);
            }
        });
    };

}]);

shopCtrl.controller('reviewsController', ['$scope', function($scope){

    $scope.rating2 = 0;
    $scope.review  = {};
    $scope.reviews = [];
    $scope.maxRating = 5;
    $scope.getNumber = function(num) {
        var arr = [];
        for(var i=0; i< num; i++){
           arr.push(i);
        }
        return arr;
    };

    ($scope.getReviews = function(){
        var Review = Parse.Object.extend('Review');
        var query = new Parse.Query(Review);
            query.equalTo("product_code", $scope.productId);
            query.find({
                success: function (results) {

                    if(typeof results[0] != 'undefined') {

                        //alert('success review query');
                        $scope.resultProduct = results[0]._serverData;
                        console.log($scope.resultProduct);
                        console.log(results);
                        for(var i =0; i< results.length; i++){
                            $scope.reviews[i] = results[i]._serverData;
                            $scope.reviews[i].createdAt = String(results[i].createdAt).substr(4,17);
                        }
                        console.log($scope.reviews);
                        $scope.noOfReviews = $scope.reviews.length;
                        $scope.$apply();
                    }
                    else {
                       // alert('No Reviews for this product');

                    }
                },
                error: function (error) {
                    alert("Error getting Reviews: " + error.code + " " + error.message);
                }
            })
        })();

    $scope.submitReview= function(){
        $scope.review.rating = $scope.rating2;
        var Review = Parse.Object.extend('Review');
        var review = new Review();
        review.set("name", $scope.review.name);
        review.set("rating", $scope.review.rating);
        review.set("reviewMessage", $scope.review.message);
        review.set("product_code", $scope.productId);
        review.save(null, {
            success :  function(review){
                alert("Thank you for the review");
                console.log("Review submitted for Product : " + $scope.productId);
                console.log(review);
                $scope.reset();
                $scope.getReviews();
                $('#reviewForm').hide();
            } ,
            error : function(review, error){
                alert("Error submitting the review");
                console.log("Error : Review not submitted for Product : " + $scope.productId);
            }
        });

    };
    $scope.reset = function(){
        $('#reviewMessage').val('');
        $("[name = 'nameReview']").val('');
    };

}]);

shopCtrl.controller('contactUsCtrl', ['$scope', function($scope){
    $scope.contact = {};


    $scope.validateContactForm = function(){
        if(typeof $scope.contact.name === 'undefined' || $scope.contact.name == ''){
            return true;
        }
        else if($scope.contact.email == '' || typeof $scope.contact.email === 'undefined'){
            return true;
        }
        else if($scope.contact.mobile == '' || typeof $scope.contact.mobile === 'undefined'){
            return true;
        }
        else if($scope.contact.message == '' || typeof $scope.contact.message === 'undefined'){
            return true;
        }
        else {
            return false;
        }


    }

    $scope.contactUs = function(){
        var Contact = Parse.Object.extend('Contact');
        var contact = new Contact();
        contact.set("sender_name", $scope.contact.name);
        contact.set("sender_email", $scope.contact.email);
        contact.set("sender_mobile", $scope.contact.mobile);
        contact.set("sender_message", $scope.contact.message);
        contact.save(null, {
            success : function(contact){
                alert('Contact message sent' + contact.id);
                console.log('Contact message sent' + contact.id);
                $('#contactusModal').modal('hide');
                $('#thankYouMessageModal').modal('show');
            } ,
            error :  function(contact, error){
                alert('Error : ' + error.id);
                console.log('Error: Sending Contact message ' +   + error.code + error.message);
            }
        });
    };
}]);