function multicast(target, key, descriptor){
	// let func = target[key];
	let func = descriptor.value;
	descriptor.value = function(list, ...rest) {
		if(Array.isArray(list)){
			return list.map(item => func.apply(this, [item].concat(rest)));
		}else{
			let item = list;
			return func.apply(this, [item].concat(rest));
		}
	};
	return descriptor;
}

class Collection {
	items:Array<any> = [];
	constructor(){}
	@multicast
	append(item, ...args:Array<any>){
		// console.log(item, Array.prototype.slice.call(arguments));
		console.log(args);
		this.items.push(item);
		return this.items.slice(-1)[0];    
	}
}

var c = new Collection();
c.append([1,2,3], 0);
c.append([4,5,6]);
console.log(c.items);
function toNumber(target, key, descriptor){
	console.log('toNumber');
	let func = descriptor.value;
	descriptor.value = function(...arg) {
		console.log(3);
		return Number(func.apply(this, arg));
	};
	return descriptor;
}

function toFixed(n){
	return function( target, key, descriptor ){
		let func = descriptor.value;
		descriptor.value = function(...arg) {
			console.log('toFixed run',n);
			return Number(func.apply(this, arg)).toFixed(n);
		};
		return descriptor;
	};
}

function logToConsole( leadingTip ){
	return function( target, key, descriptor ){
		let func = descriptor.value;
		console.log(1);
		descriptor.value = function(...arg) {
			console.log(2);
			let ret = func.apply(this, arg);
			let list = [ret];
			if( leadingTip ) list = [leadingTip, ...list];
			console.log.apply(console, list);
			console.log(3);
			return ret;
		};
		return descriptor;
	};
}

export {
	logToConsole,
	toNumber,
	toFixed
};


var a = {
	@toNumber
	@toFixed(2)
	test(arg){
		return arg;
	}
};
// var a = new test();
a.test;
var b = a.test('3333.333333');
console.log(b);
console.log(typeof b);


