import React from 'react';

import Input from './Input';

class InputInterests extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			interest: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.deleteInterest = this.deleteInterest.bind(this);
	}

	handleChange(name, value) {
		this.setState({
			[name]: value.toLowerCase()
		});
	}

	handleSubmit(backFile, body) {
		if (!this.props.value.includes(body.value) && body.value) {
			if (this.props.onSubmit) {
				this.props.onSubmit("/update/" + body.name, body);
				if (this.props.onChange) {
					this.props.onChange('interests', this.props.value.concat(body.value));
					this.setState({interest: ''});
				}
			}
		}
	}

	deleteInterest(interest)
	{
		if (this.props.onChange) {
			this.props.value.splice(this.props.value.indexOf(interest), 1)
			this.props.onChange('interests', this.props.value);
			if (this.props.onSubmit) {
				const body = {
					name: 'interest',
					action: 'delete',
					value: interest
				};
				this.props.onSubmit("/update/interest", body);
			}
		}
	}

	render() {
		return (
			<div>
				<b>Interests</b>
				<br/>
				<span>
					{
						this.props.value.map((interest, index) =>
						<span key={index}>
							<button value={interest} onClick={() => this.deleteInterest(interest)}>
							<i>#{interest}</i> <i className="fas fa-times"></i>
							</button>
							&nbsp;
						</span>
					)
				}
			</span>
			<Input
				type="text"
				name="interest"
				placeholder="Add an interest"
				value={this.state.interest}
				onChange={this.handleChange}
				onSubmit={this.handleSubmit}
				submitOnEnter
				maxLength={12}
				forbiddenChars={["[^a-z]", "gi"]}
				/>
		</div>
	);
}
}

export default InputInterests;
