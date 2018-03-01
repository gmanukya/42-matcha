import React from 'react';
import moment from 'moment';

class InputBirthdate extends React.Component {

	constructor (props) {
		super(props)
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.date.day && this.props.date.month && !moment(this.props.date.year + "/" + this.props.date.month + "/" + this.props.date.day, 'YYYY/MM/DD').isValid()) {
			var event = {
				target: {
					name: 'day', value: parseInt(prevProps.date.day, 10) - 1
				}
			};
			this.handleChange(event);
		}
	}

	handleChange(event) {
		if (this.props.onChange && this.props.name) {
			const value = {
				...this.props.date,
				[event.target.name]: event.target.value
			};
			this.props.onChange(this.props.name, value);
			if (this.props.submitOnChange) {
				this.handleSubmit(event);
			}
		}
	}

	handleSubmit(event) {
		const body = {
			name: this.props.name,
			type: event.target.name,
			value: event.target.value
		};
		this.props.onSubmit("/update/" + this.props.name, body);
	}

	showDays() {
		var days = [];
		for (var i = 1; i < 29; i++) {
			days.push(<option key={i} value={i}>{i}</option>);
		}
		for (i = 29; i < 32; i++) {
			if (!this.props.date.month || moment(this.props.date.year + "/" + this.props.date.month + "/" + i, 'YYYY/MM/DD').isValid()) {
				days.push(<option key={i} value={i}>{i}</option>);
			}
		}
		return (days);
	}

	showMonths() {
		var month = [];
		for (var i = 1; i < 13; i++) {
			month.push(<option key={i} value={i}>{moment.monthsShort(i - 1)}</option>);
		}
		return (month);
	}

	showYears() {
		var years = [];
		for (var i = moment().format("Y"); i > 1900 ; i--) {
			years.push(<option key={i} value={i}>{i}</option>);
		}
		return (years);
	}

	render() {

		return (
			<div>
				<b>Birth Date</b>
				<br/>
				<div className="inline">
				<select
					name="day"
					value={this.props.date.day}
					onChange={this.handleChange}
					>
					<option value="0" disabled>-</option>
					{this.showDays()}
				</select>

				<select
					name="month"
					value={this.props.date.month}
					onChange={this.handleChange}
					>
					<option value="0" disabled>-</option>
					{this.showMonths()}
				</select>

				<select
					name="year"
					value={this.props.date.year}
					onChange={this.handleChange}
					>
					<option value="0" disabled>-</option>
					{this.showYears()}
				</select>
			</div>
		</div>
		);
	}
}

export default InputBirthdate;
