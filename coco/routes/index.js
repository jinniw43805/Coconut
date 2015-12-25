var express = require('express');
var passport = require('passport');
var router = express.Router();
var util = require('util');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});


// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook'),function(err){});

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
	  successRedirect: '/success',
	  failureRedirect: '/error'
}));

router.get('/success',isLoggedIn ,function(req, res, next){
	  res.render('helloejs', {
	  	user : req.user,
	  	tagline : "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else."

	  });

});

router.get('/error', function(req, res, next) {
	  res.send("Error logging in.");
});

router.get('views/helloejs',function(req,res,next) {
	res.render('views/helloejs');
});

module.exports = router;

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
