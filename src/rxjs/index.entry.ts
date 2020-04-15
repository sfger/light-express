declare var Rx: any;
// var Rx = require('rxjs');
// import * as Rx from 'rxjs';
// console.log(Rx);
var increaseButton = document.querySelector( "#increase" );
var increase = Rx.Observable.fromEvent( increaseButton, "click" ) // .startWith({count:3})
  .map( () => state => {
    return Object.assign( {}, state, { count: state.count + 1 } );
  } );

var decreaseButton = document.querySelector( "#decrease" );
var decrease = Rx.Observable.fromEvent( decreaseButton, "click" ) // .startWith({count:3})
  .map( () => state => {
    return Object.assign( {}, state, { count: state.count - 1 } );
  } );

var inputElement = document.querySelector( "#input" );
var input = Rx.Observable.fromEvent( inputElement, "input" )
  .throttleTime( 300 )
  .startWith( { target: { value: inputElement.value } } )
  .map( event => state => {
    return Object.assign( {}, state, { inputValue: event.target.value } );
  } );
var obserable = Rx.Observable.merge( increase, decrease, input ).scan( ( state, changeFn ) => changeFn( state ), {
  count: 5,
  inputValue: ""
} );

// state.subscribe((state) => {
// 	document.querySelector('#count').innerHTML = state.count;
// 	document.querySelector('#hello').innerHTML = 'Hello ' + state.inputValue;
// });

var prevState = {
  count: 0,
  inputValue: "",
};
obserable.subscribe( state => {
  console.log( state );
  if ( state.count !== prevState.count ) {
    document.querySelector( "#count" ).innerHTML = state.count;
  }
  if ( state.inputValue !== prevState.inputValue ) {
    document.querySelector( "#hello" ).innerHTML = `Hello ${ state.inputValue || "--" }!`;
  }
  prevState = state;
} );
