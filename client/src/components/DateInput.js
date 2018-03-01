import React from 'react';
import moment from 'moment';

class DateInput extends React.Component {
	constructor (props) {
		super(props)
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		if (this.props.onChange) {
			this.props.onChange(e);
		}
	}

	getDays() {
		var days = [];
		for (var i = 1; i < 29; i++) {
			days.push(<option key={i} value={i}>{i}</option>);
		}
		return (days);
	}

	getMonths() {
		var days = [];
		for (var i = 1; i < 13; i++) {
			days.push(<option key={i} value={i}>{i}</option>);
		}
		return (days);
	}

	getYears() {
		var days = [];
		for (var i = moment().format("Y"); i > 1900 ; i--) {
			days.push(<option key={i} value={i}>{i}</option>);
		}
		return (days);
	}

	render() {
		return (
			<div>
				<select name="day" value={this.props.day} onChange={this.handleChange}>
					<option value="0"disabled>-</option>
					{this.getDays()}
					{
						!this.props.month || moment(this.props.year+"/"+this.props.month+"/29", 'YYYY/MM/DD').isValid()
						? <option value="29">29</option>
						: null
					}
					{
						!this.props.month || moment(this.props.year+"/"+this.props.month+"/30", 'YYYY/MM/DD').isValid()
						? <option value="30">30</option>
						: null
					}
					{
						!this.props.month || moment(this.props.year+"/"+this.props.month+"/31", 'YYYY/MM/DD').isValid()
						? <option value="31">31</option>
						: null
					}
				</select>
				<select name="month" value={this.props.month} onChange={this.handleChange}>
					<option value="0"disabled>-</option>
					{this.getMonths()}
				</select>
				<select name="year" value={this.props.year} onChange={this.handleChange}>
					<option value="0"disabled>-</option>
					{this.getYears()}
				</select>
			</div>
		);
	}
}

export default DateInput;
