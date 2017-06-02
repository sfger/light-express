// var Rx = require('rxjs');
// import * as Rx from 'rxjs';
declare var Rx:any;
var increaseButton = document.querySelector('#increase');
var increase = Rx.Observable.fromEvent(increaseButton, 'click').startWith(0)
.map(() => state => Object.assign({}, state, {count: state.count + 1}));

var decreaseButton = document.querySelector('#decrease');
var decrease = Rx.Observable.fromEvent(decreaseButton, 'click').startWith(0)
.map(() => state => Object.assign({}, state, {count: state.count - 1}));

var inputElement:any = document.querySelector('#input');
var input = Rx.Observable.fromEvent(inputElement, 'input').startWith({target:{value:inputElement.value}})
.map(event => state => Object.assign({}, state, {inputValue: event.target.value}));
var textchange = Rx.Observable.fromEvent(inputElement, 'textchange')
.map(event => state => Object.assign({}, state, {inputValue: event.target.value}));

var state = Rx.Observable.merge(increase, decrease, input, textchange).scan((state, changeFn) => changeFn(state), {
	count: 0,
	inputValue: ''
});

// state.subscribe((state) => {
// 	document.querySelector('#count').innerHTML = state.count;
// 	document.querySelector('#hello').innerHTML = 'Hello ' + state.inputValue;
// });

var prevState:any = {};
state.subscribe((state) => {
	if (state.count !== prevState.count) {
		document.querySelector('#count').innerHTML = state.count;
	}
	if (state.inputValue !== prevState.inputValue) {
		document.querySelector('#hello').innerHTML = 'Hello ' + state.inputValue;
	}
	prevState = state;
});
