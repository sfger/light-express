import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { Router, Route, browserHistory } from 'react-router';
// import {HashRouter as Router, Route, Link} from 'react-router-dom';
import { Router, Route, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
let numContext = React.createContext();
let listContext = React.createContext();
const history = createBrowserHistory();

class CommentBox extends Component {
	state = {
		nu: 12
	};
	constructor( props ) {
		super( props );
	}
	add_nu = e => {
		console.log( e );
		this.setState( {
			nu: this.state.nu + 1
		} );
	}
	render() {
		let { row, a, b } = this.props;
		return (
			<div className="commentBox">
				<div>
					<a href="javascript:" data-test="test">row:{row},a:{a},b:{b}</a>
				</div>
				<div>
					<a href="javascript:" onClick={this.add_nu}>Add nu</a>
					<span>{this.state.nu}</span>
				</div>
				<numContext.Consumer>
					{({num, add_num}) => (
						<div>
							<a href="javascript:" onClick={add_num}>Add num</a>
							<span>{num}</span>
						</div>
					)}
				</numContext.Consumer>
				<listContext.Consumer>
					{({list, list_push, list_pop}) => (
						<div>
							<a href="javascript:" onClick={list_push}>Push list</a>
							&nbsp;
							<a href="javascript:" onClick={list_pop}>Pop list</a>
							<ul>{ list.map(one => <li key={one}>{one}</li>) }</ul>
						</div>
					)}
				</listContext.Consumer>
			</div>
		);
	}
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
		this.state.count.add_num = this.add_num;
		this.state.array.list_push = this.list_push;
		this.state.array.list_pop = this.list_pop;
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
			<Router history={history}>
				<div>
					<ul>
						<li><Link to={location.pathname}>Home</Link></li>
						<li><Link to="/index">index</Link></li>
						<li><Link to="/test">test</Link></li>
					</ul>
					<div ref={this.ref}></div>
					<listContext.Provider value={this.state.array}>
						<numContext.Provider value={this.state.count}>
							<Route path={location.pathname} exact component={main} />
						</numContext.Provider>
					</listContext.Provider>
					<Route path="/index" component={home} />
					<Route path="/test" component={test} />
				</div>
			</Router>
		);
	}
}

function main() {
	let test = { a: 'aaaa', b: 'bbb' };
	return (
		<CommentBox row={'testRow'} {...test} />
	);
}

function home() {
	return <div>home</div>;
}

function test() {
	return <div>hello world</div>;
}

ReactDOM.render( <App />, document.querySelector( '#page' ) );
