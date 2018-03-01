const	{ isDev } = require('package.json'),
	errorhandler = require('errorhandler'),
	notifier = require('node-notifier');

//var isDev = ['development', 'dev'].includes(process.env.NODE_ENV.toLowerCase());
//isDev = isDev || process.env.DEV;

function errorNotification(err, str, req) {
	var title = `Error in ${req.method} ${req.url}`;
	notifier.notify({ title: title, message: str });
}

if(isDev){
	module.exports = errorhandler({ log: errorNotification });
}else{
	module.exports = null;
}