const express=	require('express')
	, bodyParser	= require('body-parser')
	, cookieParser	= require('cookie-parser')
	, multer	= require('multer')
	, consts	= require('./cfg.js')
	, fs		= require('fs')
	, ConsoleInstance=require('./apis/zconsole')
	, console	= new ConsoleInstance('Servidor')
	, getFile	= require('./pages/get-file-as-string')
	;

const app = express(),
urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('port', process.env.PORT || consts.port),
app.set('host', process.env.IP || process.env.HOST || consts.host);

app.use((err, req, res, next) => {
	if(err){
		console.error(err.stack);
		res.status(500).send(err.stack);
	}else next();
});
app.use(express.static('resources'));
//$_GET[x] = req.query[x]
app.post(urlencodedParser);
app.use(cookieParser());

var requests = {
	get: [],
	post: [],
	other: [],
	add: function(method, url, params){
		method = method.toLowerCase();
		var _method = method;
		if(!requests.hasOwnProperty(method) || method == 'ADD') _method = 'other';
		requests[_method].push({
			url: url,
			moment: Date.now(),
			params: JSON.stringify(params)
		});
	},
	push: (req, res, next) => {
		var txt = 'Requisição do tipo ' + req.method + ' para\n\t' + req.protocol + '://' + req.hostname + req.path + '\n\tVinda de ' + req.ip;
		//${req.protocol}://${req.hostname}${req.url}
		console.log(txt);
		req.setEncoding('utf8');
		//res.send(txt);
		/*domain,url,method,protocol,ip,ips,path,hostname*/
		requests.add(req.method, req.path, req.params || req.query);
		if(next) next();
	}
};
app.use(requests.push);

app.all('/', (req, res) => {
/*	let file = fs.readFileSync(`${consts.folder.html}index.html`);
	res.send(file + '');*/
	res.send(	getFile(`${consts.folder.html}index.html`));
});

app.use('/estatisticas',require('./estatisticas.js'));
app.use('/obra',	require('./pages/obra.js'));
app.use('/autor',	require('./pages/autor.js'));
app.use('/leitor',	require('./pages/leitor.js'));
app.use('/jornal',	require('./pages/jornal.js'));

var server = app.listen(app.get('port'), app.get('host'), () => {
	let {address, port} = server.address();
	if(!address.split(':').filter(v => v).length) address = '127.0.0.1';
	console.log("Rodando em http://%s:%s", address, port);
});
/*app:
use
route
set
path
*/