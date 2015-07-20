// app/routes.js


// expose the routes to our app with module.exports
module.exports = function(app, Parse, log, mandrill_client) {

    app.all('*', function(req, res, next){  
            next();
    });

    // application -------------------------------------------------------------
    app.get('/', function(req, res) {
        try{
            res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
        }
        catch(e){
            log.info("Exception Occured while loading Index Page");
        }

    });
    // api ---------------------------------------------------------------------

    app.get('/api/getAllProducts', function(req, res) {

        var Product = Parse.Object.extend('Product');
        var query = new Parse.Query(Product);
        query.find({
            success :  function(results){
                var allProducts = results;
                for(var i =0; i <results.length; i++){
                    allProducts[i] = results[i]._serverData;
                }
                log.info("Success retrieving Products");
                res.json(allProducts);

            },
            error : function(error){
                log.info("Error:  retrieving Products");
                res.send(err);
            }
        });
    });

    app.get('/api/getVendorProducts/:vendorId', function(req, res) {
        var vendorId = req.params.vendorId;
        var Product = Parse.Object.extend('Product');
        var query = new Parse.Query(Product);
        query.equalTo("vendor_id", vendorId);
        query.find({
            success :  function(results){
                var allProducts = results;
                for(var i =0; i <results.length; i++){
                    allProducts[i] = results[i]._serverData;
                }
                log.info("Success retrieving Products");
                res.json(allProducts);

            },
            error : function(error){
                log.info("Error:  retrieving Products");
                res.send(err);
            }
        });
    });


    app.get('/api/getProduct/:productId', function(req, res) {

    var productId = req.params.productId;

        var Product = Parse.Object.extend('Product');
        var query = new Parse.Query(Product);
        query.equalTo("code", productId);
        query.find({
            success: function (results) {

                if(typeof results[0] != 'undefined') {
                    log.info("Success retrieving Product : " + productId);
                   res.json(results[0]._serverData);
                }
            },
            error: function (error) {
                log.info("Error:  retrieving Product : " + productId);
                res.send(error);
            }

        });

    });

    app.post('/api/signUp', function(req, res){
       console.log('body : ' + req.body);
       var userData =  {
           username : req.body.username,
           password : req.body.password,
           name : req.body.name,
           mobile : req.body.mobile,
           email : req.body.email
       };

        var user = new Parse.User();
        user.set("username", userData.username);
        user.set("password",userData.password);
        user.set("name",userData.name);
        user.set("mobile",userData.mobile);
        user.set("email",userData.email);

        user.signUp(null, {
            success : function(user){
                log.info(userData.username + ' Signed Up');
                res.json(Parse.User.current());

            },
            error : function(user, error){
               log.info("Error: " + userData.username + ' had a SignUp Error ' + error.code + error.message);
               res.send(error);
            }
        });
    });

    app.post('/api/signIn', function(req, res){

        var userData =  {
            username : req.body.username,
            password : req.body.password
        };

        Parse.User.logIn(userData.username, userData.password,{

            success : function(user) {
                console.log(userData.username + ' logged In');
                log.info(userData.username + ' logged In');
                res.json(user);

            } ,
            error : function(user, error){
                log.info("Error: " + userData.username + ' had a logging in Error ' + error.code + error.message);
                console.log("Error: " + userData.username + ' had a logging in Error ' + error.code + error.message);
                res.send(error);
            }
        });

    });

    app.post('/api/resetPassword', function(req, res){

        var userData =  {
            username : req.body.username
        };

        Parse.User.requestPasswordReset(userData.username, {
            success: function(data) {
                // Password reset request was sent successfully
                    log.info(userData.username + ' Password Reset mail sent');
                    res.json(data);
            },
            error: function(error) {
                // Show the error message somewhere
                log.info("Error: " + userData.username + ' Password Reset Error');
                res.send(error);
            }
        });
    });

    app.post('/api/logOut', function(req, res){
        var userData =  {
            username : req.body.username
        };

        log.info(userData.username + ' logged out!');
        res.send("done");
    });

    app.post('/api/unsubscribe', function(req, res){
        var userData =  {
            username : req.body.username
        };

        log.info(userData.username + ' unsubscribed!');
        res.send("done");
    });

    app.post('/api/sendEmail', function(req, res){
        // create a variable for the API call parameters
        var sender_email = "contact@rentbingo.com";
        var params = {
            "message": {
                "from_email":sender_email,
                "to":[{"email":req.body.recipient_email}],
                "subject": req.body.subject,
                "html": "<a><img src=\"http://thednetworks.com/wp-content/uploads/2011/02/snapdeal-logo.png\"/></a><br><h2>Hey *|USER|*, Welcome to the Rentbingo family!</h2>",
                "autotext" : true,
                "track_opens" : true,
                "track_clicks" : true,
                "merge_vars": [
                    {
                        "rcpt": req.body.recipient_email,
                        "vars": [
                            {
                                "name": "USER",
                                "content": req.body.user_name
                            }
                        ]
                    }
                ]
            }
        };

        (mandrill_client.messages.send(params, function(res) {
            log.info(res);
        }, function(err) {
            log.info(err);
        }))();
    });


    app.delete('/api/todos/:todo_id', function(req, res) {



    });
    //404
    app.get('*', function(req, res){
         res.statusCode = 404;
         res.sendfile('./public/pages/404.html');
    });


};