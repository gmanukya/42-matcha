import React from 'react';

import TextArea from './TextArea';

class InputBio extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(name, value) {
		if (this.props.onChange) {
			this.props.onChange(name, value);
		}
	}

	handleSubmit(backFile, body) {
		if (this.props.onSubmit) {
			this.props.onSubmit(backFile, body);
		}
	}

	render() {
		return (
			<div>
				<b>Biography</b> ({140 - this.props.value.length})
					<br/>
					<div className="inline full floatLeft">
						<TextArea
							name="bio"
							value={this.props.value}
							height={5}
							onChange={this.handleChange}
							onSubmit={this.handleSubmit}
							maxLength={140}
							submitOnBlur
							/>
					</div>
				</div>
			);
		}
	}

	export default InputBio;
