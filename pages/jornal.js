const express = require('express')
	, gf = require('./get-file-as-string')
	;
const consts = require('./../cfg.js');

module.exports = (function(/*$*/){
	var router = express.Router();
	
	router.get('/*', function(req, res, next){
		res.send(gf(`${consts.folder.html}jornal.html`));
		if(next) next();
	});
	/*router.get('/:id_user', function(req, res){
		res.send(gf(`${consts.folder.html}jornal.html`));
	});*/
	
	return router;
})();