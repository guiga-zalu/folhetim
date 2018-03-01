//Pseudo/Meta Classes
module.exports = {
	AsciiHash	:AsciiHash,
	Int	:Int
	MaxLengthString	:(x) => {
		var max = Int(x);
		return str => str.slice(0, max);
	}
};

function AsciiHash(val){
	return String(val)
		.split('')
		.map(v => v.codePointAt(0))
		.forEach(v => ret = ret.push((v - (v % 256)) || '0', (v % 256) || '0'))
		.join('');
}
function Int(x){
	return parseInt(`${x}`);
}