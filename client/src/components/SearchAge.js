import React from 'react';
import { Range } from 'rc-slider';

class SearchAge extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(value) {
		if (this.props.onChange) {
			localStorage.setItem('ageMin', value[0]);
			localStorage.setItem('ageMax', value[1]);
			value = {
				min: value[0],
				max: value[1]
			}
			this.props.onChange('age', value);
		}
	}

	render() {

		const trackStyle = {background: '#4CB963'};
		const dotStyle = {border: "1px solid #4CB963"};

		return (
			<div>
				<b>Age :</b> <span className="searchInfos">{this.props.min} - {this.props.max > 54 ? '55+' : this.props.max}</span>
				<Range
					min={18}
					max={55}
					defaultValue={[this.props.min, this.props.max]}
					trackStyle={[trackStyle]}
					handleStyle={[dotStyle, dotStyle]}
					onAfterChange={this.handleChange}
					/>
			</div>
		);
	}
}

export default SearchAge;
