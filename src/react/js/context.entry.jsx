import React, { useState, useReducer, useContext, lazy, Suspense, Component } from 'react';
import { render as ReactDOMRender } from 'react-dom';
import { Router, Route, Switch, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { numContext, listContext } from './parts/contextList';
let history = createBrowserHistory();
class ErrorBoundary extends Component {
  constructor( props ) {
    super( props );
    this.state = { hasError: false };
  }

  static getDerivedStateFromError( error ) {
    console.log( error );
    return { hasError: true };
  }

  componentDidCatch( error, info ) {
    console.log( error, info );
  }

  render() {
    if ( this.state.hasError ) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

function Foo( props ) {
  let { row, a, b } = props;
  let { num, add_num } = useContext( numContext );
  let { list, list_push, list_pop } = useContext( listContext );
  return (
    <div className="commentBox">
      <div>
        <a href="javascript:" data-test="test">row:{ row },a:{ a },b:{ b }</a>
      </div>
      <div>
        <a href="javascript:" onClick={ add_num }>Add num</a>
        <span>{ num }</span>
      </div>
      <div>
        <a href="javascript:" onClick={ list_push }>Push list</a>
        &nbsp;
        <a href="javascript:" onClick={ list_pop }>Pop list</a>
        <ul>{ list.map( one => <li key={ one }>{ one }</li> ) }</ul>
      </div>
    </div>
  );
}

function Main() {
  let [ state ] = useReducer( reduceCount, store, init );
  let test = { a: 'aaaa', b: 'bbb' };
  return (
    <div>
      <Foo row={ 'testRow' } { ...test } />
      { state.count }
    </div>
  );
}

const MyList = lazy( () => {
  return new Promise( resolve => {
    setTimeout( () => {
      resolve( import( './parts/list.jsx' ) );
    }, 2000 );
  } );
} );

function Loading() {
  return <div>正在加载中……</div>;
}

function List( props ) {
  return (
    <Suspense fallback={ <Loading /> }>
      <MyList { ...props } />
    </Suspense>
  );
}

let store = {
  count: 0,
};

function init( initial ) {
  return Object.assign( {}, store, initial );
}

function reduceCount( state, action ) {
  switch ( action.type ) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return init( action.payload );
    default:
      throw new Error( "reduceCount need a action type" );
  }
}

function Test() {
  let [ text ] = useState( "Count: " );
  let initialCount = 0;
  // let [ count, setCount ] = useState( initialCount );
  let [ state, dispatch ] = useReducer( reduceCount, store, init );
  store = state;
  console.log( 'test' );
  return (
    <div>
      { text + state.count }
      <div>
        <a href="javascript:" onClick={ () => dispatch( { type: 'reset', payload: initialCount } ) }>reset</a>
        &nbsp;
        <a href="javascript:" onClick={ () => dispatch( { type: 'increment' } ) }>+</a>
        &nbsp;
        <a href="javascript:" onClick={ () => dispatch( { type: 'decrement' } ) }>-</a>
      </div>
    </div>
  );
}

class App extends Component {
  state = {
    count: {
      num: 5
    },
    array: {
      list: [ 'list', 'test' ]
    }
  };
  constructor( props ) {
    super( props );
    let state = this.state;
    state.count.add_num = this.add_num;
    state.array.list_push = this.list_push;
    state.array.list_pop = this.list_pop;
  }
  list_pop = () => {
    this.setState( ( state ) => {
      let array = state.array;
      if ( array.list.length < 1 ) return false;
      let { list, list_push, list_pop } = array;
      list.pop();
      return {
        array: {
          list: [ ...list ],
          list_push,
          list_pop
        }
      };
    } );
  }
  get_random_item = () => Number( String( Math.random() ).slice( 2 ) ).toString( 16 )
  list_push = () => {
    this.setState( ( state ) => {
      let array = state.array;
      if ( array.list.length >= 5 ) return false;
      let item = this.get_random_item();
      let { list, list_push, list_pop } = array;
      return {
        array: {
          list: [ ...list, item ],
          list_push,
          list_pop
        }
      };
    } );
  }
  add_num = () => {
    this.setState( ( state ) => {
      let { num, add_num } = state.count;
      return {
        count: {
          num: num + 1,
          add_num
        }
      };
    } );
  }
  render() {
    return (
      <ErrorBoundary>
        <listContext.Provider value={ this.state.array }>
          <numContext.Provider value={ this.state.count }>
            <Router history={ history }>
              <div>
                <ul>
                  <li><Link to={ location.pathname }>Main</Link></li>
                  <li><Link to="/list">list</Link></li>
                  <li><Link to="/test">test</Link></li>
                </ul>
                <div ref={ this.ref }></div>
                <Switch>
                  <Route path={ location.pathname } exact component={ Main } />
                  <Route path="/list" component={ List } />
                  <Route path="/test" component={ Test } />
                </Switch>
              </div>
            </Router>
          </numContext.Provider>
        </listContext.Provider>
      </ErrorBoundary>
    );
  }
}

ReactDOMRender( <App />, document.querySelector( '#page' ) );
