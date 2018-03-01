var router = require('express').Router();
router.get('/test*', (req, res) => {
	requests.add('get', '/test');
	var txt = `Requisição do tipo ${req.method} para
	${req.protocol}://${req.hostname}${req.path}
	${req.protocol}://${req.hostname}${req.url}
Vinda de ${req.ip}`;
	console.log(txt);
	//req.query[x] ~== $_GET[x]
	req.setEncoding('utf8');
	res.send(txt);
/*{
domain,url,method,protocol,ip,ips,path,hostname
domain,url,method,client,query,res,app,get,
is,protocol,ip,ips,subdomains,path,hostname,host,xhr,setTimeout,read
setEncoding,on,once
readable
domain
socket
connection
complete
headers
trailers
upgrade
url
method
client
baseUrl
originalUrl
params
query
res
route
app
header
get
accepts
range
param
is
protocol
secure
ip
ips
subdomains
path
hostname
host
xhr
setTimeout
read
destroy
push
unshift
isPaused
setEncoding
pipe
unpipe
on
addListener
resume
pause
emit
once
listeners
}*/
//		console.log(req[i]);
	//console.log(ret);
});
module.exports = router;