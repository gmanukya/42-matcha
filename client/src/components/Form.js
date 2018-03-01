import React from 'react';


class Form extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		this.props.onSubmit(e);
	}

	render() {
		return (
			<form method="post" onSubmit={this.handleSubmit}>
				{this.props.children}
			</form>
		);
	}
}

export default Form;
