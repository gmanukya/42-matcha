import React from 'react';
import { Range } from 'rc-slider';

class SearchPopularity extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(value) {
		if (this.props.onChange) {
				localStorage.setItem('popularityMin', value[0]);
				localStorage.setItem('popularityMax', value[1]);
			value = {
				min: value[0],
				max: value[1]
			}
			this.props.onChange('popularity', value);
		}
	}

	render() {

		const trackStyle = {background: '#4CB963'};
		const dotStyle = {border: "1px solid #4CB963"};

		var min = [];
		var max = [];
		for(var i = 1; i < 6 ; i++) {
			if(i > this.props.min) {
				min.push(<i key={i} className="far fa-star"></i>);
			}
			else {
				min.push(<i key={i} className="fas fa-star"></i>);
			}
			if(i > this.props.max) {
				max.push(<i key={i} className="far fa-star"></i>);
			}
			else {
				max.push(<i key={i} className="fas fa-star"></i>);
			}
		}


		return (
			<div>
				<b>Popularity :</b> {min} - {max}
					<Range
						min={1}
						max={5}
						defaultValue={[this.props.min, this.props.max]}
						dots={true} trackStyle={[trackStyle]}
						handleStyle={[dotStyle, dotStyle]}
						activeDotStyle={dotStyle}
						onChange={this.handleChange}
						/>
				</div>
			);
		}
	}

	export default SearchPopularity;
