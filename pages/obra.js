const express = require('express')
	, gf = require('./get-file-as-string')
	;
const consts = require('./../cfg.js');

module.exports = (function(/*$*/){
	var router = express.Router();
	
	router.get('/', function(req, res, next){
		let file;
		if('id_autor' in req.params)
			file = gf(`${consts.folder.html}obra-por-autor.html`);
		else
			file = gf(`${consts.folder.html}obras.html`);
		res.send(file);
		if(next) next();
	}).get('/:id_obra(\\d+)', function(req, res, next){
		res.send(gf(`${consts.folder.html}obra.html`));
		if(next) next();
	}).get('/:id_obra(\\d+)/sinopse', function(req, res, next){
		res.send(gf(`${consts.folder.html}sinopse.html`));
		if(next) next();
	}).get('/:id_obra(\\d+)/ler', function(req, res, next){
		res.send(gf(`${consts.folder.html}ler.html`));
		if(next) next();
	}).get('/:id_obra(\\d+)/capitulo/:num_capitulo(\\d+)', function(req, res, next){
		res.send(gf(`${consts.folder.html}info-cap.html`));
		if(next) next();
	}).get('/:id_obra(\\d+)/capitulo/:num_capitulo(\\d+)/ler', function(req, res, next){
		res.send(gf(`${consts.folder.html}ler-cap.html`));
		if(next) next();
	});
	
	return router;
})();