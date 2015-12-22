var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '152745241754004';
var FACEBOOK_APP_SECRET = '124386d523ab115915b7c4afb7029f89';

var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
// DB stuff
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };       
var mongodbUri = 'mongodb://tony:tony123@ds049104.mongolab.com:49104/coconut';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri, options);
var conn = mongoose.connection;             
conn.on('error', console.error.bind(console, 'connection error:'));  

var User = mongoose.model('User',{
  oauthID : Number,
  name : String
});



// view engine setup



app.set('views', path.join(__dirname, '/'));
app.engine('html', require('consolidate').handlebars);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//FB login
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
     console.log(accessToken);
     console.log(profile);
     //done(null, profile);
    User.findOne({ oauthID: profile.id }, function(err, user) {
      console.log("try to storing");

     if(err) { console.log(err); }
     if (!err && user != null) {
      console.log("cannot find user");
      done(null, user);

     } else {

      console.log("start storing...");
       var user = new User({
         oauthID: profile.id,
         name: profile.displayName,
         created: Date.now()
       });
       user.save(function(err) {
         if(err) {
           console.log(err);
         } else {
           console.log("saving user ...");
           done(null, user);
         };
       });
     };
    });

  });

  }
));

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user.name)
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  User.findById(obj, function(err, user){
     console.log("deserializeUser+"+user);
     if(!err) done(null, user);
     else   done(err, null)
 //done(null, obj);
  })
});


module.exports = app;
