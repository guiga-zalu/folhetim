const express = require('express')
	, gf = require('./get-file-as-string')
	;
const consts = require('./../cfg.js');

module.exports = (function(/*$*/){
	var router = express.Router();
	
	router.get('/', function(req, res, next){
		res.send(gf(`${consts.folder.html}autores.html`));
		if(next) next();
	}).get('/:id_autor(\\d+)', function(req, res, next){
		res.send(gf(`${consts.folder.html}autor.html`));
		if(next) next();
	}).use('/:id_autor(\\d+)/obras', require('./obra.js'));
	
	return router;
})();