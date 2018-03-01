const { AsciiHash, Int, MaxLengthString }	= require('./data-types')
	, ConsoleInstance	= require('./zconsole');
	, console		= new ConsoleInstance('Banco')
	;
const ret = {
	prepare	:() => {},
	'user'	:{
		insert	:() => {},
		read	:() => {},
		get	:() => {},
		getById	:() => {},
		update	:() => {},
		updateById	:() => {},
		delete	:() => {},
		deleteById	:() => {},
		model	:{
			nome	:String,
//			amigos	:['user'],
			senha	:AsciiHash,
			email	:Url
		}
	},
	'autor'	:{
		base	:'user'
	},
	'leitor'	:{
		base	:'user'
	},
	'capitulo'	:{
		insert	:() => {},
		read	:() => {},
		get	:() => {},
		update	:() => {},
		delete	:() => {},
		model	:{
			sinopse	:MaxLengthString(256),
			titulo	:MaxLengthString(128),
			texto	:String,
			numero	:Int
		}
	},
	'obra'	:{
		insert	:() => {},
		read	:() => {},
		get	:() => {},
		update	:() => {},
		delete	:() => {},
		model	:{
			sinopse	:MaxLengthString(256),
			capitulos	:['capitulo'],
			titulo	:MaxLengthString(128),
			autor	:['autor'],
			parte	:Int
		}
	},
	'jornal'	:{
		insert	:() => {},
		read	:() => {},
		get	:() => {},
		update	:() => {},
		delete	:() => {},
		model	:{
			obras	:['obra'],
			autores	:['autor']
		}
	},
	meta	:{
		spentTime	:{
			insert	:() => {},
			read	:() => {},
			avg	:(caminho) => {},
			model	:{
				caminho	:String,
				duracao	:Int
			}
		}
	}
};

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./banco.db', err => {
	if(err) return console.error(err);
	console.log('Conectado.');
});
db.$close = () => db.close(err => {
	if(err) return console.error(err);
	console.log('Desconectado');
});
ret.prepare = () => {
	db.serialize(() => {
		db.run(
`CREATE TABLE IF NOT EXISTS user(
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(96),
	email VARCHAR(48) UNIQUE,
	senha CHAR(64),
	criado DATETIME DEFAULT NOW(),
	alterado DATETIME
)`
		).run(
`CREATE TABLE IF NOT EXISTS autor(
	id INT PRIMARY KEY AUTO_INCREMENT,
	id_user INT,
	FOREIGN KEY id_user REFERENCES user(id)
)`
		).run(
`CREATE TABLE IF NOT EXISTS leitor(
	id INT PRIMARY KEY AUTO_INCREMENT,
	id_user INT,
	FOREIGN KEY id_user REFERENCES user(id)
)`
		).run(
`CREATE TABLE IF NOT EXISTS capitulo(
	id INT AUTO_INCREMENT,
	titulo VARCHAR(64),
	sinopse VARCHAR(256) DEFAULT '',
	texto TEXT,
	numero INT,
	visualizacoes INT DEFAULT 0,
	publicado BOOL DEFAULT FALSE,
	criado DATETIME DEFAULT NOW(),
	alterado DATETIME,
	id_obra INT,
	FOREIGN KEY id_obra REFERENCES obra(id),
	PRIMARY KEY(id, numero, id_obra)
)`
		).run(
`CREATE TABLE IF NOT EXISTS obra(
	id INT AUTO_INCREMENT,
	titulo VARCHAR(64),
	sinopse VARCHAR(256) DEFAULT '',
	texto TEXT DEFAULT '',
	parte INT DEFAULT 0,
	visualizacoes INT DEFAULT 0,
	publicado BOOL DEFAULT FALSE,
	criado DATETIME DEFAULT NOW(),
	alterado DATETIME
)`
		).run(
`CREATE TABLE IF NOT EXISTS autor_obra(
	id_autor INT,
	id_obra INT,
	FOREIGN KEY id_autor REFERENCES autor(id),
	FOREIGN KEY id_obra REFERENCES obra(id),
	PRIMARY KEY(id_autor, id_obra)
)`
		).run(
`CREATE TABLE IF NOT EXISTS jornal(
	id_leitor INT,
	id_autor INT,
	id_obra INT,
	FOREIGN KEY id_leitor REFERENCES leitor(id),
	FOREIGN KEY id_autor REFERENCES autor(id),
	FOREIGN KEY id_obra REFERENCES obra(id),
	PRIMARY KEY(id_leitor, id_autor, id_obra)
)`
		);
	});
};


//ret.user
ret.user.insert = function(user, cb){
	cb = cb || err => {
		if(err) console.error(err);
		else console.log('Usuário Inserido.');
	};
	
	var err = null;
	const { nome, email, senha } = user;
	if(![nome, email, senha].reduce((a, b) => a || b.length > 5, false))
		err = new Error('Dados faltando!');
	
	if(err) console.error(err);
	db.run(
		'INSERT INTO user(nome, email, senha) VALUES(?, ?, ?)',
		[nome, new URL(email).location, AsciiHash(senha)], cb
	);
};

ret.user.read = function(query, cb){
	query = query || '1=1';
	if(!cb) return console.error(new Error('Requisição geral sem utilidade.\n\tPossível Ataque! C(R)U D'));
	db.each('SELECT id, nome, email, criado, alterado FROM user WHERE ?', [query], cb);
};

ret.user.get = function(email, senha, cb){
	if(!cb) return console.error(new Error('Requisição de usuário sem utilidade.\n\tPossível Invasão! C(R)U D'));
	db.get(
		'SELECT id, nome, email, criado, alterado FROM user WHERE (nome = "?" OR email = "?") AND senha = "?"',
		[email, email, senha], cb
	);
};

ret.user.getById = function(id, cb){
	if(!cb) return console.error(new Error('Requisição de usuário sem utilidade.\n\tPossível Invasão! C(R)U D'));
	db.get('SELECT id, nome, email, criado, alterado FROM user WHERE id = ?', [id], cb);
};

ret.user.update = function(email, senha, valores){
	db.run(
		'UPDATE user SET ?, alterado = NOW() WHERE (nome = "?" OR email = "?") AND senha = "?"',
		[valores, email, email, senha]
	);
};

ret.user.updateById = function(id, valores){
	db.run('UPDATE user SET ?, alterado = NOW() WHERE id = ?', [valores, id]);
};

ret.user.delete = async function(email, senha){
	ret.user.get(email, senha, (row) => {
		let {id} = row;
		ret.user.deleteById(id);
	});
};

ret.user.deleteById = function(id){
	db.serialize(() => {
		db
			.run(`DELETE FROM leitor WHERE id_user = ?`, [id])
			.run(`DELETE FROM autor WHERE id_user = ?`, [id])
			.run(`DELETE FROM user WHERE id = ?`, [id]);
	});
};


//ret.autor
ret.autor.insert = async function(autor, cb){
	cb = cb || err => {
		if(err) console.error(err);
		else console.log('Autor Inserido.');
	};
	
	var err = null;
	const { nome, email, senha } = autor;
	if(![nome, email, senha].reduce((a, b) => a || b.length > 5, false))
		err = new Error('Dados faltando!');
	if(err) console.error(err);
	
	ret.user.insert(autor, (err, row) => {
		if(err) return cb(err);
		
		var id_user = row.id;
		db.run('INSERT INTO autor(id_user) VALUES(?)', [id_user], cb);
	});
};

ret.autor.read = function(query, cb){
	query = query || '1=1';
	if(!cb) return console.error(new Error('Requisição geral sem utilidade.\n\tPossível Ataque! C(R)U D'));
	
	db.each(
`SELECT id autor.id, nome user.nome, email user.email, criado user.criado, alterado user.alterado
	FROM autor INNER JOIN user
	ON autor.id_user = user.id
	WHERE ?`, [query], cb);
};

ret.autor.get = function(email, senha, cb){
	if(!cb) return console.error(new Error('Requisição de usuário sem utilidade.\n\tPossível Invasão! C(R)U D'));
	
	db.get(
`SELECT id autor.id, nome user.nome, email user.email, criado user.criado, alterado user.alterado
	FROM autor INNER JOIN user
	ON autor.id_user = user.id
	WHERE (user.nome = "?" OR user.email = "?") AND user.senha = "?"`, [email, email, senha], cb);
};

ret.autor.getById = function(id, cb){
	if(!cb) return console.error(new Error('Requisição de usuário sem utilidade.\n\tPossível Invasão! C(R)U D'));
	
	db.get(
`SELECT id autor.id, nome user.nome, email user.email, criado user.criado, alterado user.alterado
	FROM autor INNER JOIN user
	ON autor.id_user = user.id
	WHERE autor.id = ?`, [id], cb);
};

ret.autor.update = ret.user.update;

ret.autor.updateById = function(id, valores){
	db.get('SELECT id_user FROM autor WHERE id = ?', [id], (err, row) => {
		let id_user = row.id_user;
		
		db.run(`UPDATE user SET ?, alterado = NOW() WHERE id = ?`, [valores, id_user]);
	});
};

ret.autor.delete = function(email, senha){
	db.run(
		'DELETE FROM user WHERE (nome = "?" OR email = "?") AND senha = "?"',
		[email, email, senha]);
};

ret.autor.deleteById = function(id){
	db.get('SELECT id_user FROM autor WHERE id = ?', [id], (err, row) => {
		db
			.run(`DELETE FROM autor WHERE id = ?`, [row.id])
			.run(`DELETE FROM user WHERE id = ?`, [row.id_user]);
	});
};


//ret.leitor
ret.leitor.insert = async function(leitor, cb){
	cb = cb || err => {
		if(err) console.error(err);
		else console.log('Autor Inserido.');
	};
	
	var err = null;
	const { nome, email, senha } = leitor;
	if(![nome, email, senha].reduce((a, b) => a || b.length > 5, false))
		err = new Error('Dados faltando!');
	if(err) console.error(err);
	
	ret.user.insert(leitor, (err, row) => {
		if(err) return cb(err);
		
		var id_user = row.id;
		db.run('INSERT INTO leitor(id_user) VALUES(?)', [id_user], cb);
	});
};

ret.leitor.read = function(query, cb){
	query = query || '1=1';
	if(!cb) return console.error(new Error('Requisição geral sem utilidade.\n\tPossível Ataque! C(R)U D'));
	
	db.each(
`SELECT id leitor.id, nome user.nome, email user.email, criado user.criado, alterado user.alterado
	FROM leitor INNER JOIN user
	ON leitor.id_user = user.id
	WHERE ?`, [query], cb);
};

ret.leitor.get = function(email, senha, cb){
	if(!cb) return console.error(new Error('Requisição de usuário sem utilidade.\n\tPossível Invasão! C(R)U D'));
	
	db.get(
`SELECT id leitor.id, nome user.nome, email user.email, criado user.criado, alterado user.alterado
	FROM leitor INNER JOIN user
	ON leitor.id_user = user.id
	WHERE (user.nome = "?" OR user.email = "?") AND user.senha = "?"`, [email, email, senha], cb);
};

ret.leitor.getById = function(id, cb){
	if(!cb) return console.error(new Error('Requisição de usuário sem utilidade.\n\tPossível Invasão! C(R)U D'));
	
	db.get(
`SELECT id leitor.id, nome user.nome, email user.email, criado user.criado, alterado user.alterado
	FROM leitor INNER JOIN user
	ON leitor.id_user = user.id
	WHERE leitor.id = ?`, [id], cb);
};

ret.leitor.update = ret.user.update;

ret.leitor.updateById = function(id, valores){
	db.get('SELECT id_user FROM leitor WHERE id = ?', [id], (err, row) => {
		let id_user = row.id_user;
		
		db.run(`UPDATE user SET ?, alterado = NOW() WHERE id = ?`, [valores, id_user]);
	});
};

ret.leitor.delete = function(email, senha){
	db.run(
		'DELETE FROM user WHERE (nome = "?" OR email = "?") AND senha = "?"',
		[email, email, senha]);
};

ret.leitor.deleteById = function(id){
	db.get('SELECT id_user FROM leitor WHERE id = ?', [id], (err, row) => {
		db
			.run(`DELETE FROM leitor WHERE id = ?`, [row.id])
			.run(`DELETE FROM user WHERE id = ?`, [row.id_user]);
	});
};


//ret.capitulo
ret.capitulo
	insert
	read
	get
	getById
	update
	updateById
	delete
	deleteById


//ret.obra
ret.obra
	insert
	read
	get
	getById
	update
	updateById
	delete
	deleteById


//ret.jornal
ret.jornal
	insert
	read
	get
	getById
	update
	updateById
	delete
	deleteById

module.exports = ret;