

module.exports = {	
	dbURL : "mongodb://tony:tony123@ds049104.mongolab.com:49104/coconut",
	options :  { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }
}