var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require('../app/models/user');



router.post('/authenticate', function( req, res, next) {
	User.findOne({
		name : req.body.name
	}, function( err, user) {
		if (err) {throw err}
		else{
			if(!user){
				res.json({ success: false, message: 'Authentication failed. User not found.'});
			} else if( user){


				//check user exist 
				if (user.password != req.body.password) {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });

				}else{
					// pass authentication

					var token = jwt.sign(user,'key', {
						expiresInMinutes: 1440 // expires in 24 hours

					});

					res.json({
			        	success: true,
			        	message: 'Enjoy your token!',
			        	token: token
			        });
				}
			}
		}
	});
});

/* GET users listing. */
router.get('/setup', function(req, res, next) {
	// create a sample user
  	var nick = new User({ 
    	name: 'tony', 
    	password: 'tony123',
    	admin: true 
  	});

  	// save the sample user
  	nick.save(function(err) {
    	if (err) throw err;

    	console.log('User saved successfully');
    	res.json({ success: true });
  	});

});


// set middleware to vertify a token


router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token,'key', function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});



router.get('/find',function( req, res, next) {
	User.find({}, function( err, users) {
		res.json(users);
	});
});

router.get('/',function( req, res, next) {
	res.send("this user api");
});

module.exports = router;
