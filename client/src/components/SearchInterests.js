import React from 'react';

import Input from './Input';

class SearchInterests extends React.Component {

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

	handleSubmit(backfile, body) {
		if (!this.props.value.includes(body.value) && body.value) {
		if (this.props.onSubmit) {
			if (this.props.onChange) {
				this.props.onChange('interests', this.props.value.concat(body.value));
				this.props.value.concat(body.value).forEach((elem, index) => {
					localStorage.setItem('interest' + index, elem);
				});
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
				localStorage.setItem('interest0', '');
				this.props.value.forEach((elem, index) => {
				localStorage.setItem('interest' + (index + 1), '');
				localStorage.setItem('interest' + index, elem);
			});
			if (this.props.onSubmit) {
			}
		}
	}

	render() {
		return (
			<div>
				<b>Interests :</b>
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
				{this.props.value.length < 3 ?
					<div className="inline">
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
					</div> : null}
					</div>
				);
			}
		}

		export default SearchInterests;
