import React from 'react';

class SearchOrderBy extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		if (this.props.onChange) {
			this.props.onChange('orderBy', event.target.value);
			localStorage.setItem('orderBy', event.target.value);
		}
	}

	render() {
		return (
			<div className="noWrap">
				<b>Sort by : </b>
				<select
					value={this.props.value}
					onChange={this.handleChange}
					>
					<option value="0" disabled> </option>
					<option value="ageAsc">Age - Younger first</option>
					<option value="ageDesc">Age - Elder first</option>
					<option disabled> </option>
					<option value="popularityDesc">Most popular</option>
					<option value="popularityAsc">Less popular</option>
					<option disabled> </option>
					{
						this.props.locationIsPrivate ?
						null :
						[
							<option key="distance" value="distance">Distance</option>,
								<option key="space" disabled> </option>
							]
						}
						<option value="interests">Common interests</option>
					</select>
				</div>
			);
		}
	}

	export default SearchOrderBy;
