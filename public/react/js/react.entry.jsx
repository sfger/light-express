import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import * as reducers from './parts/reducers';
const store = createStore(combineReducers(reducers), {
	num:3,
	list:['test','list']
});
const {dispatch,getState} = store;

let CommentBox = ({row,a,b,num,list,add_num,list_push,list_pop})=>{
	return (
		<div className="commentBox">
			<div>
				<a href="javascript:" data-test="test">row:{row},a:{a},b:{b}</a>
			</div>
			<div>
				<a href="javascript:" onClick={add_num}>Add num</a>
				<span>{num}</span>
			</div>
			<div>
				<a href="javascript:" onClick={list_push}>Push list</a>
				&nbsp;
				<a href="javascript:" onClick={list_pop}>Pop list</a>
				<ul>
					{
						list.map(function(one){
							return <li key={one}>{one}</li>;
						})
					}
				</ul>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		num: state.num,
		list: state.list
	}
};
const mapDispatchToProps = (dispatch) => {
	return {
		count_click: () => {
			dispatch({type:'ADD'});
		},
		add_num: () => {
			dispatch({type:'ADD'});
		},
		list_push: () => {
			// dispatch({type:'PUSH', text:'test'})
			if(getState().list.length>=5) return false;
			dispatch({type:'PUSH', text:Number(String(Math.random()).slice(2)).toString(16)})
		},
		list_pop: () => {
			dispatch({type:'POP'})
		}
	}
};
const ListShow = connect(mapStateToProps, mapDispatchToProps)(CommentBox);

let test = {a:'aaa', b:'bbb'};
ReactDOM.render(
	<Provider store={store}>
		<ListShow row={'row'} {...test} />
	</Provider>,
	document.querySelector('#page')
);
