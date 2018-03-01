import React, { Component } from 'react';

class Errors extends Component {

	render() {
		var errors = '';
		if (Array.isArray(this.props.errors)) {
			errors = (
				<ul>
					{this.props.errors.map((error) =>
						<li key={error}>{error}</li>
					)}
				</ul>
			);
		}
		else {
			errors = (
				<ul>
					<li>{this.props.errors}</li>
				</ul>
			);
		}
		return (
			<div>
				{errors}
			</div>
		);
	}
}

export default Errors;
