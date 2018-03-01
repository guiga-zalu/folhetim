new Promise(() > )
	then(() > )
	catch((erro) > )

prepare()
user
	insert(user : {nome, email, senha}, (erro) > )
	read(query, ({nome, email, criado, alterado}) > )
	get(nome || email, senha, ({nome, email, criado, alterado}) > )
	getById(id, ({nome, email, criado, alterado}) > )
	update(nome || email, senha, valores)
	updateById(id, valores)
	delete(nome || email)
	deleteById(id)
	model
		nome	:String
		amigos	:['user']
		senha	:AsciiHash
		email	:Url
		criado	:Date
		alterado:Date
autor
	insert(autor : {nome, email, senha}, (erro) > )
	read(query, ({nome, email, criado, alterado}) > )
	get(nome || email, senha, ({nome, email, criado, alterado}) > )
	getById(id, ({nome, email, criado, alterado}) > )
	update(nome || email, senha, valores)
	updateById(id, valores)
	delete(nome || email)
	deleteById(id)
	base	:'user'
	model
		id	:Int
leitor
	insert(leitor : {nome, email, senha}, (erro) > )
	read(query, ({nome, email, criado, alterado}) > )
	get(nome || email, senha, ({nome, email, criado, alterado}) > )
	getById(id, ({nome, email, criado, alterado}) > )
	update(nome || email, senha, valores)
	updateById(id, valores)
	delete(nome || email)
	deleteById(id)
	base	:'user'
	model
		id	:Int
capitulo
	insert()
	read()
	get()
	update()
	delete()
	model
		id	:Int
		titulo	:MaxLengthString(128)
		sinopse	:MaxLengthString(256)
		texto	:String
		numero	:Int
		visualizacoes	:Int
		publicado	:Date,
		criado	:Date,
		alterado:Date
obra
	insert()
	read()
	get()
	update()
	delete()
	model
		id	:Int
		titulo	:MaxLengthString(128)
		sinopse	:MaxLengthString(256)
		capitulos	:['capitulo']
		autor	:['autor']
		parte	:Int
		visualizacoes	:Int
		publicado	:Date,
		criado	:Date,
		alterado:Date
jornal
	insert()
	read()
	get()
	update()
	delete()
	model
		obras	:['obra']
		autores	:['autor']

meta
	spentTime
		insert()
		read()
		avg(caminho)
		model
			caminho	:String
			duracao	:Int