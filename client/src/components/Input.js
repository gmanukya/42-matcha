import React from 'react';

class Input extends React.Component {

	constructor(props) {
		super(props);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleKeyDown(event) {
		if (event.which === 13) {
			if (this.props.blurOnEnter) {
				event.target.blur();
			}
			if (this.props.submitOnEnter) {
				this.handleSubmit(event.target.name, event.target.value);
			}
		}
	}

	handleChange(event) {
		if (this.props.onChange) {
			if (this.props.forbiddenChars) {
				const regex = new RegExp(this.props.forbiddenChars[0], this.props.forbiddenChars[1]);
				event.target.value = event.target.value.replace(regex, '');
			}
			if (this.props.maxLength) {
				event.target.value = event.target.value.substring(0, this.props.maxLength);
			}
			this.props.onChange(event.target.name, event.target.value);
			if (this.props.submitOnChange) {
				this.handleSubmit(event.target.name, event.target.value);
			}
		}
	}

	handleBlur(event) {
		if (this.props.submitOnBlur) {
			this.handleSubmit(event.target.name, event.target.value);
		}
	}

	handleSubmit(name, value) {
		if (this.props.onSubmit  && name) {
			const body = {
				name: name,
				value: value
			};
			this.props.onSubmit("/update/" + name, body);
		}
	}

	validateProps() {
		const validProps = ['id', 'type', 'name', 'value', 'placeholder', 'checked', 'disabled'];
		var finalProps = {};
		for (var key in this.props) {
			if (validProps.includes(key)) {
				finalProps[key] = this.props[key] ;
			}
		}
		return (finalProps);
	}

	render() {
		return (
			<input
				{...this.validateProps()}
				onKeyDown={this.handleKeyDown}
				onChange={this.handleChange}
				onBlur={this.handleBlur}
				/>
		);
	}
}

export default Input;
