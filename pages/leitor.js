const express = require('express')
	, gf = require('./get-file-as-string')
	;
const consts = require('./../cfg.js');

module.exports = (function(/*$*/){
	var router = express.Router();
	
	router.get('/', function(req, res, next){
		res.send(gf(`${consts.folder.html}leitores.html`));
		if(next) next();
	}).get('/:id_user(\\d+)', function(req, res, next){
		res.send(gf(`${consts.folder.html}leitor-perfil.html`));
		if(next) next();
	});
	
	return router;
})();