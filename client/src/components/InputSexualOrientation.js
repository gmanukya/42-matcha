import React from 'react';

import Input from './Input';

class InputSexualOrientation extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(name, value) {
		if (this.props.onChange) {
			this.props.checked.includes(value) ? this.props.checked.splice(this.props.checked.indexOf(value), 1) : this.props.checked.push(value);
			value = this.props.checked;
			this.props.onChange(name, value);
		}
	}

	handleSubmit(backFile, body) {
		if (this.props.onSubmit) {
			body.value = this.props.checked.toString().replace(',', '');
			body.value = body.value === "" ? 0 : body.value === "M" ? 1 : body.value === "F" ? 2 : 3;
			this.props.onSubmit(backFile, body);
		}
	}

	render() {

		return (
			<div>
				<b>Interested in</b>
				<br/>
				<div className="inline full">
					<label htmlFor="orientationM">Men</label>
					<Input
						id="orientationM"
						type="checkbox"
						name="sexual_orientation"
						value="M"
						checked={this.props.checked.includes("M")}
						onChange={this.handleChange}
						onSubmit={this.handleSubmit}
						submitOnChange
						/>
					<div className="inline spaceLeft">
						<label htmlFor="orientationF">Women</label>
						<Input
							id="orientationF"
							type="checkbox"
							name="sexual_orientation"
							value="F"
							checked={this.props.checked.includes("F")}
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

export default InputSexualOrientation;
