const ConsoleInstance	= require('./zconsole')
	, console	= new ConsoleInstance('Banco de Dados')
	;

const sqlite3 = require('sqlite3').verbose();

module.exports = class DB{
	constructor(nome, open, prepare, close){
		//nome[, open], prepare[, close]
		switch(arguments.length){
			case 0:
			case 1:
				return new Error('Sem argumentos suficientes!');
			case 2:
				prepare = open;
				open = err => {
					if(err) return console.error(err);
					console.log('Conectado.');
				};
				close = err => {
					if(err) return console.error(err);
					console.log('Desconectado');
				};
			case 3:
				close = prepare;
				prepare = open;
				open = err => {
					if(err) return console.error(err);
					console.log('Conectado.');
				};
			case 4:
			default:
				break;
		}
		this.nome = String(nome);
		this.db = new sqlite3.Database(this.nome, open);
		this.close = close;
		this.prepare(this.db);
	}
};