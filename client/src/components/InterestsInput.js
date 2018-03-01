import React from 'react';

class InterestsInput extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			interests: ''
		};
		if (!Array.isArray(this.props.interests)) {
			this.props.interests = [];
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.deleteInterest = this.deleteInterest.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value.toLowerCase().replace(/[^0-9a-z]/g, '');
		const name = target.name;
		this.setState({
			[name]: value.substring(0, 12)
		});
	}

	handleKeyDown(event) {
		if (event.which === 13) {
			if (this.state.interests) {
				this.props.onKeyDown(event);
				this.setState({
					interests: ''
				});
			}
		}
	}

	deleteInterest(event)
	{
		event.preventDefault();
		this.props.deleteInterest(event);
	}

	render() {
	return (
		<div>
			<span>
				{this.props.interests.map((interest, index) =>
					<span key={index}>
						#{interest}
						<button
							type="button"
							value={interest}
							onClick={this.deleteInterest}
							>
							&#10006;
						</button>
						&nbsp;
					</span>
				)}
			</span>
			<input
				type="text"
				value={this.state.interests}
				name="interests"
				placeholder="Interests"
				onKeyDown={this.handleKeyDown}
				onChange={this.handleChange}/>
		</div>
	);
}
}

export default InterestsInput;
