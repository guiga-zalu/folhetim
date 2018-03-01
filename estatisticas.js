const express	= require('express')
	, data	= require('./data')('estatisticas')
	;
var router = express.Router();

var spentTime = express.Router();
spentTime.all('/:tempo(\\d+)/*', (req, res, next) => {
	data.data.spentTime = data.data.spentTime || [];
	
	let tempo = req.params.tempo,
	caminho = req.path;
	data.data.spentTime.push({
		caminho: caminho.slice(caminho.indexOf('/', 1)),
		duracao: +tempo
	});
	data.save();
	/*data.spentTime.register({
		caminho: caminho.slice(caminho.indexOf('/', 1)),
		duracao: +tempo
	});*/
	
	if(next) next();
});
router.use('/spent-time', spentTime);

module.exports = router;