import React from 'react';

import Input from './Input';

class InputPassword extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(name, value) {
		if (this.props.onChange) {
			if (name === 'password') {
				value = {
					old: "",
					new: ""
				}
			}
			else {
				value = {
					...this.props.value,
					[name]: value
				}
			}
			this.props.onChange('password', value);
		}
	}

	handleSubmit() {
		if (this.props.onSubmit) {
			const body = {
				name: 'password',
				old: this.props.value.old,
				new: this.props.value.new
			}
			this.props.onSubmit('/update/password', body);
			this.handleChange('password', "");
		}
	}

	render() {

		const disabled = (this.props.value.old && this.props.value.new) ? null : 'disabled';

		return (
			<div>
				<b>Change your password</b>
				<br/>
				<div className="inline quarter">
					<Input
						type="password"
						name="old"
						placeholder="Old password"
						value={this.props.value.old}
						onChange={this.handleChange}
						maxLength={20}
						/>
				</div>
				<div className="inline quarter spaceLeft">
					<Input
						type="password"
						name="new"
						placeholder="New password"
						value={this.props.value.new}
						onChange={this.handleChange}
						onSubmit={this.handleSubmit}
						blurOnEnter
						submitOnEnter
						maxLength={20}
						/>
				</div>
				<div className="inline spaceLeft">
					<button onClick={this.handleSubmit} disabled={disabled}>Submit</button>
				</div>
			</div>
		);
	}
}

export default InputPassword;
