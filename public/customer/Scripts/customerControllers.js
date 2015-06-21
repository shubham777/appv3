/**
 * Created by Shubham on 04-05-2015.
 */
'use strict'

var profileCounter = 0;

var customerControllers = angular.module('customerControllers',['customerServices']);


customerControllers.controller('storeController', ['$scope', function($scope){}]);
customerControllers.controller('profileController', ['$scope', function($scope){

    $scope.user = {

    };

    $scope.setLocalStorage = function(){ debugger;
        localStorage.setItem('name', $scope.user.name);
        localStorage.setItem('email', $scope.user.email);
        localStorage.setItem('phone1', $scope.user.phone1);
        localStorage.setItem('country', $scope.user.country);

        if($scope.customerAccountExisting) {
            if(typeof $scope.user.phone2 != 'undefined')
                localStorage.setItem('phone2', $scope.user.phone2);
            localStorage.setItem('address', $scope.user.address);
            localStorage.setItem('city', $scope.user.city);
            localStorage.setItem('pincode', $scope.user.pincode);
            localStorage.setItem('country', $scope.user.country);
            localStorage.setItem('state', $scope.user.state.name);
            localStorage.setItem('imageUrl', $scope.user.imageUrl);
            localStorage.setItem('customerAccountExisting', true);
        }
        else
        {
            localStorage.setItem('customerAccountExisting', false);
        }
    };



    $scope.getLocalStorage = function(){
        debugger;
        $scope.user.name =  localStorage.getItem('name');
        $scope.user.email = localStorage.getItem('email');
        $scope.user.phone1 = localStorage.getItem('phone1');
        $scope.user.country = localStorage.getItem('country');

        if(localStorage.getItem('customerAccountExisting')) {
            $scope.user.phone2 =  localStorage.getItem('phone2');
            $scope.user.address = localStorage.getItem('address');
            $scope.user.city = localStorage.getItem('city');
            $scope.user.pincode = localStorage.getItem('pincode');
            $scope.user.state = $scope.states.filter(function(el){
                return el.name == localStorage.getItem('state');
            })[0];
            if(localStorage.getItem('imageUrl') != 'undefined')
            $('#profileImage').attr('src', localStorage.getItem('imageUrl'));
        }

    };



    $scope.clearLocalStorage = function(){
        localStorage.clear();
    };

    if(Parse.User.current()) {
        var currentUser = Parse.User.current()._serverData;
    }
    else{
        var currentUser = {
            name :  localStorage.getItem('currentUserName'),
            username : localStorage.getItem('currentUserEmail'),
            mobile :  localStorage.getItem('currentUserMobile')
        };
    }

    $scope.customerAccountExisting = false;
    $scope.states = [{name : '--Please Select Your State--'},{name : 'Andaman'},{name : 'Karnataka'},{name :'Uttar Pradesh'}];

    debugger;

    if(typeof localStorage.name != 'undefined' && typeof localStorage.city != 'undefined'){
        $scope.getLocalStorage();
    }
    else {

        if (currentUser == null) {
            alert('No User');
        }
        else {
                if(window.location.hash == "#/profile"){
                    var Customer = Parse.Object.extend('Customer');
                    var query = new Parse.Query(Customer);
                    query.equalTo("email", currentUser.username);
                    query.find({
                        success: function (results) {
                            $scope.customer = results[0];
                            if (typeof $scope.customer === 'undefined') {
                                $scope.customerAccountExisting = false;

                            }
                            else {
                                $scope.customerAccountExisting = true;

                            }

                            $('#updateForm').click();
                        },
                        error: function (error) {
                            alert("Error: " + error.code + " " + error.message);
                        }
                    });

                }
        }
    }

    $scope.checkCustomerAccountExisting  = function(){

    };

    $scope.populateForm  = function(){debugger;
        $scope.user.name = currentUser.name;
        $scope.user.email = currentUser.username;
        $scope.user.phone1 = currentUser.mobile;
        $scope.user.country = 'India';
        $scope.user.state = $scope.states[0];

    };

    $scope.getCustomerDetails = function(){debugger;
        $scope.user.name = $scope.customer.get('name');
        $scope.user.email = $scope.customer.get('email');
        $scope.user.phone1 = $scope.customer.get('phone_1');
        $scope.user.phone2 = $scope.customer.get('phone_2');
        $scope.user.address = $scope.customer.get('address');
        $scope.user.city = $scope.customer.get('city');
        $scope.user.pincode = $scope.customer.get('pincode');
        $scope.user.country = 'India';
        $scope.user.state = $scope.states.filter(function(el){
            return el.name == $scope.customer.get('state')
        })[0];
        $scope.user.imageUrl = $scope.customer.get('imageUrl');
         if($scope.user.imageUrl)
            $('#profileImage').attr('src', $scope.user.imageUrl);



    };

    $scope.updateForm = function(){debugger;
        if($scope.customerAccountExisting){
           $scope.getCustomerDetails();
        }
        else{
            $scope.populateForm();
        }
        $scope.setLocalStorage();
    };



    $scope.uploadProfilePhoto = function(){
            debugger;
      alert('hi');

    };



    $scope.validateUpdation = function(){
            debugger;
        if(typeof $scope.user.name === 'undefined' || $scope.user.name == ''){
            return true;
        }
        else if($scope.user.email == '' || typeof $scope.user.email === 'undefined'){
            return true;
        }
        else if($scope.user.phone1 == '' || typeof $scope.user.phone1 === 'undefined'){
            return true;
        }
        else if($scope.user.address == '' || typeof $scope.user.address === 'undefined'){
            return true;
        }
        else if($scope.user.city == '' || typeof $scope.user.city === 'undefined'){
            return true;
        }
        else if($scope.user.pincode == '' || typeof $scope.user.pincode === 'undefined'){
            return true;
        }
        else if(typeof $scope.user.state != 'undefined' ) {
            if($scope.user.state.name === '--Please Select Your State--' || $scope.user.state.name == '')
                return true;
        }
        else{
            return false;
        }


    };


    $scope.updateProfile = function(){

      var Customer = Parse.Object.extend('Customer');
        var customer = new Customer();

        customer.save({
            name : $scope.user.name,
            email : $scope.user.email,
            phone_1 : $scope.user.phone1,
            phone_2 : $scope.user.phone2,
            address : $scope.user.address,
            state : $scope.user.state.name,
            city : $scope.user.city,
            pincode : $scope.user.pincode

        },{
            success : function(customer){
              alert("success " + customer.id);
               // $scope.customerAccountExisting = true;
                $('#thankYouModal').modal();
            },
            error : function(customer, error){
                alert(error.code + "" + error.message);
            }
        });

    };

}]);
customerControllers.controller('navbarController', ['$scope', '$http', function($scope,$http){
    if(Parse.User.current()) {
        var currentUser = Parse.User.current()._serverData;
    }
    else{
        var currentUser = {
            name :  localStorage.getItem('currentUserName'),
            username : localStorage.getItem('currentUserEmail'),
            mobile :  localStorage.getItem('currentUserMobile')
        };
    }
    $scope.currentUserName = currentUser.name;
    $scope.currentUserEmail = currentUser.username;

    $scope.clearLocalStorage = function(){
        localStorage.clear();
    };

    $scope.logOut = function(){

        if(typeof Parse.User.current()){
            Parse.User.logOut();
        }

        $scope.clearLocalStorage();

        var user = {
            username :  $scope.currentUserEmail
        };
        //console.log(user);

        $http.post('/api/logOut', user)
            .success(function(data, status, headers, config){
                window.location.reload();
            })
            .error(function(error){
            });



    };
    debugger;
    $scope.newMessageCount = 0;
    $scope.newNotificationCount = 0;

    $scope.messages = [];
    $scope.notifications = [];

    ($scope.updateNewMessages = function(){

        var username = currentUser.username;
        var Message = Parse.Object.extend('Message');
        var query = new Parse.Query('Message');
        query.equalTo("vendor_id", username);
        query.equalTo("read_status", false);
        query.find({
            success :  function(results){

                $scope.newMessages = results;
                $scope.newMessageCount = $scope.newMessages.length;
                $scope.updateMessageBox();
                //$scope.$apply();


            } ,
            error : function(results, error){
               // console.log("Error: Retreiving new Message Count for " + username);
                alert("Error: Retreiving new Message Count for " + username);
            }
        });
    })();

    ($scope.updateNewNotifications = function(){

        var username = currentUser.username;
        var Notification = Parse.Object.extend('Notification');
        var query = new Parse.Query('Notification');
        query.equalTo("vendor_id", username);
        query.equalTo("read_status", false);
        query.find({
            success :  function(results){
                $scope.newNotifications = results;
                $scope.newNotificationCount = $scope.newNotifications.length;
                $scope.updateNotificationBox();
                $scope.$apply();


            } ,
            error : function(results, error){
               // console.log("Error: Retreiving new notification Count for " + username);
                alert("Error: Retreiving new notification Count for " + username);
            }
        });
    })();

    $scope.updateMessageBox = function(){
            var j =0;
        for(var i=$scope.newMessageCount,j=0; i>0 ; i--, j++) {
            $scope.messages[i-1] = $scope.newMessages[j]._serverData;
            $scope.messages[i-1].dateTime = String($scope.newMessages[j].createdAt).substr(4,20);
            $scope.messages[i-1].id = $scope.newMessages[j].id;
        }

    };

    $scope.updateNotificationBox = function(){
        var j =0;
        for(var i=$scope.newNotificationCount,j=0; i>0 ; i--, j++) {
            $scope.notifications[i-1] = $scope.newNotifications[j]._serverData;
            $scope.notifications[i-1].dateTime = String($scope.newNotifications[j].createdAt).substr(4,20);
            $scope.notifications[i-1].id = $scope.newNotifications[j].id;
        }
    };






}]);
customerControllers.controller('loginCtrl', ['$scope', '$http', function($scope, $http){


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
    };

    $scope.logOut = function(){
        if(typeof Parse.User.current()){
            Parse.User.logOut();
        }
        $scope.freeLocalStorage();
        $('#spinner').show();
        setTimeout(function(){
            $('#spinner').hide();
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
               // console.log("Email data : " + data);
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

customerControllers.controller('messagesCtrl', ['$scope', function($scope){
    if(Parse.User.current()) {
        var currentUser = Parse.User.current()._serverData;
    }
    else{
        var currentUser = {
            name :  localStorage.getItem('currentUserName'),
            username : localStorage.getItem('currentUserEmail'),
            mobile :  localStorage.getItem('currentUserMobile')
        };
    }
        $scope.messages = [];
    var username = currentUser.username;

    if(typeof currentUser != 'undefined') {
        ($scope.updateNewMessages = function(){

            var username = currentUser.username;
            var Message = Parse.Object.extend('Message');
            var query = new Parse.Query('Message');
            query.equalTo("vendor_id", username);
            query.equalTo("read_status", false);
            query.find({
                success :  function(results){
                    $scope.newMessages = results;
                    $scope.newMessageCount = $scope.newMessages.length;
                    $scope.updateMessageBox();
                    $scope.$apply();


                } ,
                error : function(results, error){
                  //  console.log("Error: Retreiving new Message Count for " + username);
                    alert("Error: Retreiving new Message Count for " + username);
                }
            });
        })();
    }


    $scope.updateReadStatus = function(id){
        var Message = Parse.Object.extend('Message');
        var message = new Message();
        message.set("objectId", id);
        message.set("read_status", true);
        message.save(null,{
            success: function(message){

               // alert("Read status changed");
               // console.log("Read status changed for vendor :" + username);
            },
            error :  function(error){
               // console.log("Error Updating read Status for vendor: " + username + ' ' + error.code + ' ' + error.message);
            }
        });
    };

    $scope.updateMessageBox = function(){
        var j =0;
        for(var i=$scope.newMessageCount,j=0; i>0 ; i--, j++) {
            $scope.messages[i-1] = $scope.newMessages[j]._serverData;
            $scope.messages[i-1].dateTime = String($scope.newMessages[j].createdAt).substr(4,20);
            $scope.messages[i-1].id = $scope.newMessages[j].id;
        }

    };

}]);

customerControllers.controller('notificationsCtrl', ['$scope', function($scope){
    if(Parse.User.current()) {
        var currentUser = Parse.User.current()._serverData;
    }
    else{
        var currentUser = {
            name :  localStorage.getItem('currentUserName'),
            username : localStorage.getItem('currentUserEmail'),
            mobile :  localStorage.getItem('currentUserMobile')
        };
    }
    $scope.notifications = [];
    var username = currentUser.username;

    if(typeof currentUser != 'undefined') {
        ($scope.updateNewNotifications = function(){

            var username = currentUser.username;
            var Notification = Parse.Object.extend('Notification');
            var query = new Parse.Query('Notification');
            query.equalTo("vendor_id", username);
            query.equalTo("read_status", false);
            query.find({
                success :  function(results){
                    $scope.newNotifications = results;
                    $scope.newNotificationCount = $scope.newNotifications.length;
                    $scope.updateNotificationBox();
                    $scope.$apply();


                } ,
                error : function(results, error){
                   // console.log("Error: Retreiving new notification Count for " + username);
                    alert("Error: Retreiving new notification Count for " + username);
                }
            });
        })();
    }

    $scope.updateNotificationBox = function(){
        var j =0;
        for(var i=$scope.newNotificationCount,j=0; i>0 ; i--, j++) {
            $scope.notifications[i-1] = $scope.newNotifications[j]._serverData;
            $scope.notifications[i-1].dateTime = String($scope.newNotifications[j].createdAt).substr(4,20);
            $scope.notifications[i-1].id = $scope.newNotifications[j].id;
        }
    };

    $scope.updateReadStatus = function(id){

    };

}]);

customerControllers.controller('ordersController', ['$scope', function($scope){
    if(Parse.User.current()) {
        var currentUser = Parse.User.current()._serverData;
    }
    else{
        var currentUser = {
            name :  localStorage.getItem('currentUserName'),
            username : localStorage.getItem('currentUserEmail'),
            mobile :  localStorage.getItem('currentUserMobile')
        };
    }

    /*
    $scope.order = {};
    $scope.orders = [];
    $scope.order.productCode = "Product3";
    $scope.order.productName = "Queen Size Double Bed with Side Tables";
    $scope.order.imageUrl = "/app/img/products/demo11.jpg";
    $scope.order.startingDate =  new Date();
    $scope.order.rent = 600;
    $scope.order.duration = "Monthly";
    $scope.order.customerName =  "Rahul Dravid";
    $scope.order.customerContact = "9985630102";
    $scope.order.customerEmail  = "rahuldravide@gmail.com";
    $scope.order.customerNationalIdType =  "Driving License";
    $scope.order.customerNationalIdNo = "Y6B789";
    $scope.order.customerAddress = "Punjabi Rasoi, Near Mc Donalds, HSR Layout";
    $scope.order.customerCity = "Bangalore";
    $scope.order.customerState = "Karnataka";
    $scope.order.ownerId = currentUser.username;


    $scope.addOrder = function(){
        var Order = Parse.Object.extend('Order');
        var order = new Order();
            order.set("product_code", $scope.order.productCode);
            order.set("owner_id", $scope.order.ownerId);
            order.set("product_name", $scope.order.productName);
            order.set("product_image_url", $scope.order.imageUrl);
            order.set("starting_date", $scope.order.startingDate);
            order.set("rent", $scope.order.rent);
            order.set("duration", $scope.order.duration);
            order.set("customer_name", $scope.order.customerName);
            order.set("customer_contact", $scope.order.customerContact);
            order.set("customer_email", $scope.order.customerEmail);
            order.set("customer_national_id_type", $scope.order.customerNationalIdType);
            order.set("customer_national_id_no", $scope.order.customerNationalIdNo);
            order.set("customer_city", $scope.order.customerCity);
            order.set("customer_state", $scope.order.customerState);
            order.set("customer_address", $scope.order.customerAddress);
            order.save(null, {
               success :  function(order, error){
                    alert('Order Created');
                  // console.log('Order created for :' + currentUser.name);
               } ,
               error :  function(error){
                   alert("Error creating order");
                  // console.log('Error : Order not created for :' + currentUser.name + ' ' + error.code + ' ' + error.message);
               }
            });

    };

    $scope.getOrders = function(){
      var Order = Parse.Object.extend('Order');
      var query = new Parse.Query(Order);
        query.equalTo("owner_id", currentUser.username);
        query.find({
           success :  function(results){
               $scope.updateOrdersList(results);
               $scope.$apply();
           } ,
            error :  function(error){
                alert("Error Getting order");
              //  console.log('Error : Getting Orders for :' + currentUser.name + ' ' + error.code + ' ' + error.message);
            }
        });
    }();

    $scope.updateOrdersList = function(results){

        for(var i =0; i< results.length; i++){
            $scope.orders[i] = results[i]._serverData;
            $scope.orders[i].id = results[i].id;
            $scope.orders[i].position = i;
        }

    };

    $scope.populateIndividualOrder = function(position){

        $scope.individualOrder = $scope.orders[position];

    };
    */
}]);

customerControllers.controller("editController",['$scope','$http', function($scope, $http){
    $scope.allProducts = [];
    $scope.products = [];
    $scope.noOfVisibleProducts = 12;
    var vendor_id = localStorage.getItem("currentUserEmail");
    ($scope.getProds = function(){
        $('#spinner').show();

        $http.get('/api/getVendorProducts/' + vendor_id)
            .success(function(data){
                $scope.allProducts = data;
                if($scope.allProducts.length == 0){
                    $('#spinner').hide();
                    $('#zeroProducts').show();
                    return;
                }
                $scope.updateProducts(0,$scope.noOfVisibleProducts,$scope.allProducts.length);
                $('#spinner').hide();
            })
            .error(function(data){

            });

    })();

    $scope.updateProducts = function(first,last, length){
        if(length < last){
            for(var i=first; i< length; i++){
                $scope.products[i] = $scope.allProducts[i];
                localStorage.setItem("f",first);
                localStorage.setItem("l", length);
                return;
            }
        }
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

customerControllers.controller('editSelectedProductController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){

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
           // console.log($scope.resultProduct);
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
                           // console.log(product);
                            $('#productAdd').hide();
                            $('#imagesAdd').show();
                            $('#updateProductCode').click();
                        },
                        error: function (error) {
                            alert("Error");
                           // console.log(error.code + ' ' + error.message);
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

customerControllers.controller('settingsController', ['$scope','$http', function($scope,$http){
    var user = {
        username :  $scope.currentUserEmail
    };


    $scope.unsubscribe = function(){
        $http.post('/api/unsubscribe', user)
            .success(function(data, status, headers, config){
                if(data == 'done'){
                    alert("You are unsubscribed!");
                }
                else{
                    alert("Error : Please try again later!");
                }
            })
            .error(function(error){
            });
    };
}]);