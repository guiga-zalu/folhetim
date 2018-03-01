const ConsoleInstance	= require('./zconsole')
	, DB	= require('./database')
	;
ConsoleInstance.MAX_DISPLAY_LENGTH = 20;
const console	= new ConsoleInstance('Banco - Estatísticas');
const db = new DB('./estatisticas.db', db => {
	db.run(
`CREATE TABLE IF NOT EXISTS spentTime(
	caminho VARCHAR(128),
	duracao INT
)`
	);
});

db.spentTime = {};
db.spentTime.register = val => {
	const { caminho, duracao } = val;
	caminho = caminho || '/';
	duracao |= 0;
	if(duracao)
		db.db.run(
			'INSERT INTO spentTime(duracao, caminho) VALUES (?, ?)',
			[duracao, caminho]);
};
db.spentTime.perPage = async function(caminho, all, cb){
	caminho = String(caminho);
	if(argument.length == 2){
		cb = all;
		all = false;
	}
	var values = [];
	if(all)
		await db.db.each(
			'SELECT duracao FROM spentTime WHERE caminho LIKE "?%"',
			[caminho], (err, row) => values.push(row.duracao));
	else
		await db.db.each(
			'SELECT duracao FROM spentTime WHERE caminho = "?"',
			[caminho], (err, row) => values.push(row.duracao));
	cb(values);
};
db.spentTime.totalPerPage = function(caminho, all, cb){
	caminho = String(caminho);
	if(argument.length == 2){
		cb = all;
		all = false;
	}
	if(all)
		db.db.get(
			'SELECT SUM(duracao) total FROM spentTime WHERE caminho LIKE "?%"',
			[caminho], (err, row) => cb(row.total));
	else
		db.db.get(
			'SELECT SUM(duracao) total FROM spentTime WHERE caminho = "?"',
			[caminho], (err, row) => cb(row.total));
};
db.spentTime.avgPerPage = function(caminho, all, cb){
	caminho = String(caminho);
	if(argument.length == 2){
		cb = all;
		all = false;
	}
	if(all)
		db.db.get(
			'SELECT AVG(duracao) media FROM spentTime WHERE caminho LIKE "?%"',
			[caminho], (err, row) => cb(row.duracao));
	else
		db.db.get(
			'SELECT AVG(duracao) media FROM spentTime WHERE caminho = "?"',
			[caminho], (err, row) => cb(row.duracao));
};
db.spentTime.avg = function(cb){
	db.db.get('SELECT AVG(duracao) media FROM spentTime", (err, row) => values.push(row.media));
};
db.spentTime.total = function(cb){
	db.db.get('SELECT SUM(duracao) total FROM spentTime", (err, row) => cb(row.total));
};

module.exports = db;