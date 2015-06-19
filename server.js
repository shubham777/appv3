// server.js (final)

// set up ======================================================================
var express  = require('express');
var app      = express();                               // create our app w/ express
var port     = process.env.PORT || 8050;                // set the port
var database = require('./config/database');            // load the database config
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var logentries = require('node-logentries');
var log = logentries.logger({
    token:'4e4946fd-454e-4733-a27a-15f4e714cc14'
});
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('mRLpHOnQJFiZclLbjahO6A');
var multer  = require('multer');
var done=false;
// configuration ===============================================================
var Parse = require('parse').Parse;
Parse.initialize("2jT2a7YjlWSXRrhcNL8TSph4uy5g0Er5degdz9hL", "u4uGj6polu3Izo6jd4BOYeTsnQf9tvXLfpHKkZu2");

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.use(multer({
    dest: './public/img/uploads/',
    rename: function (fieldname, filename) {
        return fieldname+Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done=true;
    }
}));

// routes ======================================================================
require('./app/routes.js')(app, Parse, log, mandrill_client);

app.post('/api/productPhoto',function(req,res){
    if(req.files.product == undefined || req.body.product.code == undefined){
        res.sendfile('./public/pages/error_adding_product.html');
    }
    if(done==true){
        try {
            var noOfImages = req.files.product.length;
            var productCode = req.body.product.code;

            if (noOfImages > 0 && noOfImages <= 9) {
                var Product = Parse.Object.extend('Product');
                var query = new Parse.Query(Product);
                query.equalTo("code", req.body.product.code);
                query.first({
                    success: function (product) {
                        if (noOfImages == 1) {
                            product.set("image_url_1", req.files.product[0].path.substr(6));
                        }
                        else if (noOfImages == 2) {
                            product.set("image_url_1", req.files.product[0].path.substr(6));
                            product.set("image_url_2", req.files.product[1].path.substr(6));
                        }
                        else if(noOfImages >=  3 && noOfImages <= 9) {
                            product.set("image_url_1", req.files.product[0].path.substr(6));
                            product.set("image_url_2", req.files.product[1].path.substr(6));
                            product.set("image_url_3", req.files.product[2].path.substr(6));
                        }
                        else{
                            return;
                        }

                        product.save(null, {
                            success: function (product) {

                                log.info("Success :  Uploading Image Urls for Product :" + product._serverData.code + " for Vendor : " + product._serverData.vendor_id);
                                console.log("Success :  Uploading Image Urls for Product :" + product._serverData.code + " for Vendor : " + product._serverData.vendor_id);
                            },
                            error: function (error, product) {
                                log.info("Error :  Uploading Image Urls for Product :" + product._serverData.code + " for Vendor : " + product._serverData.vendor_id);
                                console.log("Error :  Uploading Image Urls for Product :" + product._serverData.code + " for Vendor : " + product._serverData.vendor_id);
                            }
                        });
                        res.sendfile('./public/pages/product_added.html');
                    },
                    error: function (error, product) {
                        log.info("Error1 :  Uploading Image Urls for Product :");
                        console.log("Error1 :  Uploading Image Urls for Product :");
                    }
                });

            }
            else {
                res.sendfile('./public/pages/error_adding_product.html');
            }
        }
        catch(e){
            log.info(e.message);
            console.log(e.message);
        }
    }

});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
