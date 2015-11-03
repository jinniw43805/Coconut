var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var config = require('../../config');
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };       

var Schema = mongoose.Schema;
var mongodbUri = config.database;
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri, options);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('coconutUser',new Schema({
	name : String,
	password : String,
	admin : Boolean
}));

