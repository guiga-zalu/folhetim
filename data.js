module.exports = function(file_name){
	const fs = require('fs');
	
	if(!file_name.endsWith('.json'))
		file_name += '.json';
	else if(!file_name.endsWith('.'))
		file_name += 'json';
	
	var ret = {
		file_name: file_name,
		save: async function(){
			var data = this.data2text();
			try{
				fs.writeFileSync(this.file_name, data);
			}catch(e){
				console.error(e);}
		},
		data2text: function(){
			return JSON.stringify(this.data);
		},
		text2data: function(){
			return JSON.parse(this.text);
		},
		open: function(){
			try{
				this.text = fs.readFileSync(this.file_name);
				this.data = this.text2data();
			}catch(e){
				console.error(e);
				this.data = {};
				if(!this.text) this.text = '';
			}
		}
	};
	
	ret.open();
	
	return ret;
};
/*class Data{
	constructor(file_name){
		if(!file_name.endsWith('.json'))
			file_name += '.json';
		else if(!file_name.endsWith('.'))
			file_name += 'json';
		
		this.file_name = file_name;
		
		this.open();
	}
	get text2data(){return JSON.parse(this.text);}
	get data2text(){return JSON.stringify(this.data);}
	open(){
		try{
			this.text = fs.readFileSync(this.file_name);
			this.data = this.text2data;
		}catch(e){
			console.error(e);
			this.data = {};
			if(!this.text) this.text = '';
		}
	}
	async save(){
		try
			fs.writeFileSync(this.file_name, this.data2text);
		catch(e)
			console.error(e);
	}
}
module.exports = (f) => new Data(f);*/