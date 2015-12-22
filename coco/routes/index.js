var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('views/index.html');
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

router.get('/success',function(req, res, next){
  // res.render('views/index.html',{
  // 	user : req.user
  // });
	res.send("Successful");

});

router.get('/error', function(req, res, next) {
	  res.send("Error logging in.");
});

module.exports = router;
