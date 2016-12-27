// import React from 'react';
// import ReactDOM from 'react-dom';
import {createStore, combineReducers} from 'redux';
import * as reducers from './parts/reducers';
__non_webpack_require__.config({
	baseUrl: '../../',
	urlArgs: document.getElementById("mainjs").getAttribute("data-version"),
	map: {"*":{css:"require-css"}},
	paths: {
		'react': 'public/js/react.min',
		'react-dom': 'public/js/react-dom.min'
	},
	shim: {
		'react-dom':{deps:["react"]}
	}
});
__non_webpack_require__(['react', 'react-dom'], function(React, ReactDOM){
	// function reducer(s, t){
	// 	let num = s.num;
	// 	switch(t.type){
	// 		case 'ADD':{
	// 			num++;
	// 			break;
	// 		}
	// 		default:{
	// 			num;
	// 		}
	// 	}
	// 	return {num};
	// }
	const reducer = combineReducers(reducers);
	const store = createStore(reducer, {
		num:0,
		list:[]
	});
	const {dispatch, subscribe, getState} = store;
	console.log(store);
	console.log(getState());
	dispatch({type:'ADD'});
	console.log(getState());
	dispatch({type:'PUSH', text:'test'});
	console.log(getState());
	dispatch({type:'PUSH', text:'list'});
	console.log(getState());
	dispatch({type:'POP'});
	console.log(getState());

	let CommentBox = React.createClass({
		getInitialState: function(){
			return {count:0};
		},
		getDefaultProps : function () {
			return {
				title:'Hello World'
			};
		},
		test: function(){
			this.setState({
				count:this.state.count + 1,
			}, function(){
				console.log(222,this.state.count);
				console.log(this.props.a);
			});
			console.log(111,this.state.count);
		},
		render: function(){
			return (
				<div className="commentBox" data-test="test" onClick={this.test}>
				{this.props.title}! I am a CommentBox. Counter: {this.state.count}
				</div>
			);
		}
	});
	let test = {a:'aaa', b:'bbb'};

	function render(){
		console.log('render');
		ReactDOM.render(
			<CommentBox row={1} {...test} />,
				document.querySelector('#page')
		);
	}
	render();

	let unsubscribe = subscribe(render);
	// unsubscribe();
});
