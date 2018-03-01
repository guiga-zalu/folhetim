class ConsoleInstance{
	constructor(name){
		if(!(this instanceof ConsoleInstance)) return new ConsoleInstance(...arguments);
		this.display = `[${name}]`;
		for(var i in this){
			if(i != 'trace'
			&& this.hasOwnProperty(i)
			&& (typeof this[i] === 'function' || typeof this[i] === 'object')
			) this[i].parent = this;
		}
	}
	get display(){return this._display;}
	set display(x){this._display = `${x}`.slice(0, ConsoleInstance.MAX_DISPLAY_LENGTH);}
	assert(bool, msg, ...vals){
		if(typeof msg === 'string') console.assert(bool, `${this.display} ${msg}`, ...vals);
		else console.assert(bool, this.display, ...arguments);
	}
	count(label){
		if(label) console.count(`${this.display} ${label}`);
		else console.count();
	}
	debug(){this.log(...arguments);}
	dir(obj){
		this.log('Dir');
		console.dir(obj);
	}
	dirxml(obj){
		this.log('Dir');
		(console.dirxml || console.dir)(obj);
	}
	error(msg, ...vals){
		if(typeof msg === 'string') console.error(`${this.display} ${msg}`, ...vals);
		else console.error(this.display, ...arguments);
	}
	exception(){this.error(...arguments);}
	group(label){
		if(label) console.group(`${this.display} ${label}`);
		else console.group();
	}
	groupCollapsed(label){
		if(label) console.groupCollapsed(`${this.display} ${label}`);
		else console.groupCollapsed();
	}
	groupEnd(){console.groupEnd();}
	info(msg, ...vals){
		if(typeof msg === 'string') console.info(`${this.display} ${msg}`, ...vals);
		else console.info(this.display, ...arguments);
	}
	log(msg, ...vals){
		if(typeof msg === 'string') console.log(`${this.display} ${msg}`, ...vals);
		else console.log(this.display, ...arguments);
	}
	time(nome){console.time(`${this.display} ${nome}`);}
	timeEnd(nome){console.timeEnd(`${this.display} ${nome}`);}
	get trace(){
		this.log(this.display);
		console.trace.bind(console);
	}
	warn(msg, ...vals){
		if(typeof msg === 'string') console.warn(`${this.display} ${msg}`, ...vals);
		else console.warn(this.display, ...arguments);
	}
	getLogger(){return this.log.bind(this);}
}
ConsoleInstance.MAX_DISPLAY_LENGTH = 16;
module.exports = ConsoleInstance;