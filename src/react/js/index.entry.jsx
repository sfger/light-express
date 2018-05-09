import "~public/js/requestAnimationFrame.js";
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import * as reducers from './parts/reducers';
const store = createStore( combineReducers( reducers ), {
	num: 3,
	list: [ 'test', 'list' ]
} );
const { dispatch, subscribe, getState } = store;

let CommentBox = React.createClass( {
	getInitialState: function () {
		return { count: 0 };
	},
	getDefaultProps: function () {
		return {
			title: 'Hello World'
		};
	},
	test: function () {
		this.setState( {
			count: this.state.count + 1,
		}, function () {
			console.log( 222, this.state.count );
			console.log( this.props.a, this.props.row );
		} );
		console.log( 111, this.state.count );
	},
	num: function () {
		dispatch( { type: 'ADD' } );
	},
	list: function () {
		dispatch( { type: 'PUSH', text: Number( String( Math.random() ).slice( 2 ) ).toString( 16 ) } );
	},
	render: function () {
		return (
			<div className="commentBox">
				<div>
					<a href="javascript:" data-test="test" onClick={this.test}>{this.props.title}! I am a CommentBox. Counter: {this.state.count}</a>
				</div>
				<div>
					<a href="javascript:" onClick={this.num}>Add num</a>
					<span>{getState().num}</span>
				</div>
				<div>
					<a href="javascript:" onClick={this.list}>Push list</a>
					<ul>
						{
							getState().list.map(function(one){
								return <li>{one}</li>;
							})
						}
					</ul>
				</div>
			</div>
		);
	}
} );
let test = { a: 'aaa', b: 'bbb' };

function render() {
	ReactDOM.render(
		<CommentBox row={'row'} {...test} />,
		document.querySelector( '#page' )
	);
}
render();

let unsubscribe = subscribe( render );
// unsubscribe();
