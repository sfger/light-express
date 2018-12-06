import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
// import { Router, Route, browserHistory } from 'react-router';
// import {HashRouter as Router, Route, Link} from 'react-router-dom';
import { Router, Route, Link } from 'react-router-dom';
import { createBrowserHistory /*, createHashHistory*/ } from 'history';
import { /*syncHistoryWithStore,*/ routerReducer } from 'react-router-redux';
import reducers from './parts/reducers';
const store = createStore( combineReducers( {
  ...reducers,
  routing: routerReducer
} ), {
  num: 3,
  list: [ 'test', 'list' ]
} );
const { /*dispatch,*/ getState } = store;
// console.log(dispatch.toString());
// console.log(subscribe,store);
// const history = syncHistoryWithStore(createHashHistory(), store);
const history = createBrowserHistory();

class CommentBox extends Component {
  state = {
    nu: 12
  };
  constructor( props ) {
    super( props );
    // this.state = {
    // 	nu:0
    // };
  }
  // componentWillMount() {
  //   console.log( 'will', this );
  // }
  componentDidMount() {
    console.log( 'did', this );
  }
  add_nu = e => {
    console.log( e );
    this.setState( {
      nu: this.state.nu + 1
    } );
  }
  render() {
    let { row, a, b, num, list, add_num, list_push, list_pop } = this.props;
    return (
      <div className="commentBox">
        <div>
          <a href="javascript:" data-test="test">row:{row},a:{a},b:{b}</a>
        </div>
        <div>
          <a href="javascript:" onClick={ this.add_nu }>Add nu</a>
          <span>{this.state.nu}</span>
        </div>
        <div>
          <a href="javascript:" onClick={ add_num }>Add num</a>
          <span>{num}</span>
        </div>
        <div>
          <a href="javascript:" onClick={ list_push }>Push list</a>
          &nbsp;
          <a href="javascript:" onClick={ list_pop }>Pop list</a>
          <ul>
            {
              list.map(function(one){
                return <li key={ one }>{one}</li>;
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

const mapStateToProps = ( state ) => {
  // console.log(state);
  // return {
  // 	num: state.num,
  // 	list: state.list
  // }
  return { ...state };
};
const mapDispatchToProps = ( dispatch ) => {
  return {
    count_click: () => {
      dispatch( { type: 'ADD' } );
    },
    add_num: ( e ) => {
      console.log( e );
      dispatch( { type: 'ADD' } );
    },
    list_push: () => {
      // dispatch({type:'PUSH', text:'test'})
      if ( getState().list.length >= 5 ) return false;
      dispatch( { type: 'PUSH', text: Number( String( Math.random() ).slice( 2 ) ).toString( 16 ) } );
    },
    list_pop: () => {
      dispatch( { type: 'POP' } );
    }
  };
};
const ListShow = connect( mapStateToProps, mapDispatchToProps )( CommentBox );

let test = { a: 'aaa', b: 'bbb' };
ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history }>
      <div>
        <ul>
          <li><Link to={ location.pathname }>Home</Link></li>
          <li><Link to="/index">index</Link></li>
          <li><Link to="/test">test</Link></li>
        </ul>
        <Route path={ location.pathname } exact render={ ()=>{
          return <ListShow row={ 'testRow' } { ...test } />;
        } }/>
        <Route path="/index" render={ ()=>{
          return <div>home</div>;
        } }/>
        <Route path="/test" render={ ()=>{
          return <div>hello world</div>;
        } } />
      </div>
    </Router>
  </Provider>,
  document.querySelector( '#page' )
);
