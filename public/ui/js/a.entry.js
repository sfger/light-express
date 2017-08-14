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
	}
	return descriptor;
}

class Collection {
	// items:Array<any> = [];
	items = [];
	constructor(){
	}

	@multicast
	append(item, ...args:Array<any>){
		// console.log(item, Array.prototype.slice.call(arguments));
		this.items.push(item);
		return this.items.slice(-1)[0];    
	}
}

var c = new Collection();
c.append([1,2,3], 0);
c.append([4,5,6]);
console.log(c.items);
