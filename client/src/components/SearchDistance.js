import React from 'react';
import Slider from 'rc-slider';

class SearchDistance extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(value) {
		if (this.props.onChange) {
			localStorage.setItem('distanceMax', value);
			this.props.onChange('distanceMax', value);
		}
	}

	render() {

		const trackStyle = {background: '#4CB963'};
		const dotStyle = {border: "1px solid #4CB963"};

		return (
			<div>
				<b>Distance :</b> less than {this.props.max} km
				<Slider
					min={2}
					max={160}
					defaultValue={this.props.max}
					trackStyle={[trackStyle]}
					handleStyle={[dotStyle]}
					onChange={this.handleChange}
					/>
			</div>
		);
	}
}

export default SearchDistance;
