export function num(state=0, action){
	switch(action.type){
		case 'ADD':{
			return state + 1;
		}
		case 'MINUS':{
			return state - 1;
		}
		default:{
			return state;
		}
	}
}

export function list(state=[], action){
	switch(action.type){
		case 'PUSH':{
			state.push(action.text);
			return state;
		}
		case "POP":{
			state.pop();
			return state;
		}
		default:{
			return state;
		}
	}
}
