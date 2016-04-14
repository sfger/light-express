var React = require('react');
var ReactDOM = require('react-dom');
var CommentBox = React.createClass({
	getInitialState: function () {
		return { count: 0 };
	},
	test: function(){
		this.setState({
			count: this.state.count + 1,
		}, function(){
			console.log(222,this.state.count);
		});
		console.log(111,this.state.count);
	},
	render: function() {
		return (
			<div className="commentBox" onClick={this.test}>
				Hello, world! I am a CommentBox.
			</div>
		);
	}
});
ReactDOM.render(
	<CommentBox />,
	document.querySelector('#page')
);
