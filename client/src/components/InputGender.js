import React from 'react';

import Input from './Input';

class InputGender extends React.Component {

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
			body.value = body.value === "M" ? 1 : body.value === "F" ? 2 : 0;
			this.props.onSubmit(backFile, body);
		}
	}

	render() {
		return (
			<div>
				<b>Gender</b>
				<br/>
				<div className="inline full">
				<label htmlFor="genreM">Male</label>
				<Input
					id="genreM"
					type="radio"
					name="gender"
					value="M"
					checked={this.props.checked === "M"}
					onChange={this.handleChange}
					onSubmit={this.handleSubmit}
					submitOnChange
					/>
				<div className="inline spaceLeft">
				<label htmlFor="genreF">Female</label>
				<Input
					id="genreF"
					type="radio"
					name="gender"
					value="F"
					checked={this.props.checked === "F"}
					onChange={this.handleChange}
					onSubmit={this.handleSubmit}
					submitOnChange
					/>
			</div>
			</div>
		</div>
		);
	}
}

export default InputGender;
