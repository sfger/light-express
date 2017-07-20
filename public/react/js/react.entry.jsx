import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import reducers from './parts/reducers';
// console.log(reducers)
const store = createStore(combineReducers(reducers), {
	num:3,
	list:['test','list']
});
const {dispatch,getState} = store;

class CommentBox extends Component{
	constructor(props) {
		super(props);
		// this.state = {};
	}
	componentWillMount(test){
		console.log('will', this);
	}
	componentDidMount(test){
		console.log('did', this);
	}
	render(){
		let {row,a,b,num,list,add_num,list_push,list_pop} = this.props;
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
	}
}
/*
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
*/

const mapStateToProps = (state) => {
	console.log(state);
	// return {
	// 	num: state.num,
	// 	list: state.list
	// }
	return {...state};
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
		<ListShow row={'testRow'} {...test} />
	</Provider>,
	document.querySelector('#page')
);
