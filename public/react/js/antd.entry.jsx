import "~/public/js/requestAnimationFrame.js";
import React from 'react';
import ReactDOM from 'react-dom';
let mountNode = document.querySelector('#page');

(async function(){
	await Promise.resolve();
	console.log('test');
}());

import { Button, Radio, Icon } from 'antd';

class ButtonSize extends React.Component {
	state = {
		size: 'default'
	};
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		size: 'default',
	// 	};
	// }
	handleSizeChange = (e) => {
		this.setState({ size: e.target.value });
	}

	render() {
		const size = this.state.size;
		return (
			<div>
				<Radio.Group value={size} onChange={this.handleSizeChange}>
					<Radio.Button value="large">Large</Radio.Button>
					<Radio.Button value="default">Default</Radio.Button>
					<Radio.Button value="small">Small</Radio.Button>
				</Radio.Group>
				<br /><br />
				<Button type="primary" shape="circle" icon="download" size={size} />
				<Button type="primary" icon="download" size={size}>Download</Button>
				<Button type="primary" size={size}>Normal</Button>
				<br /><br />
				<Button.Group size={size}>
					<Button type="primary">
						<Icon type="left" />Backward
					</Button>
					<Button type="primary">
						Forward<Icon type="right" />
					</Button>
				</Button.Group>
			</div>
		);
	}
}

ReactDOM.render(<ButtonSize />, mountNode);
