import React from 'react';

import Input from './Input';

const Geolocator = require('../modules/Geolocator');

class InputLocation extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.locateMe = this.locateMe.bind(this);
	}

	handleChange(name, value) {
		if (this.props.onChange) {
			value = {
				address: value
			};
			this.props.onChange(name, value);
		}
	}

	handleSubmit(backFile, body) {
		if (this.props.onSubmit) {
			Geolocator.addressToCoords(body.value, location => {
				if (location) {
					body = {
						name: 'location',
						latitude: location.coords.latitude,
						longitude: location.coords.longitude
					}
					this.props.onSubmit(backFile, body);
					Geolocator.coordsToAddress(location.coords.latitude, location.coords.longitude, location => {
						this.handleChange('location', location.formattedAddress);
					})
				}
				else {
					this.handleChange('location', "");
				}
			});
		}
	}

	locateMe() {
		const name = 'location';
		Geolocator.locateMe(location => {
			const body = {
				name: 'location',
				latitude: location.coords.latitude,
				longitude: location.coords.longitude
			};
			if (location.provider === "freegeoip") {
				body.private = 1;
				this.handleChange(name, "Location blocked");
			}
			else {
				this.handleChange(name, location.formattedAddress);
			}
			this.props.onSubmit('/update/' + name, body);
		})
	}

	render() {
		return (
			<div>
				<b>Location</b>
				<br/>
				<div className="inline threequarters">
				<Input
					type="text"
					name="location"
					placeholder="Location"
					value={this.props.value.address}
					onChange={this.handleChange}
					onSubmit={this.handleSubmit}
					submitOnBlur
					blurOnEnter
					/>
			</div>
			<div className="inline spaceLeft">
				<button onClick={() => this.handleSubmit('/update/location', {value: this.props.value.address})}>Search</button>
			</div>
			<div className="inline spaceLeft">
				|
			</div>
			<div className="inline spaceLeft">
				<button onClick={this.locateMe}>Locate me <i className="fas fa-map-marker-alt"></i>
			</button>
			</div>
			</div>
		);
	}
}
//<span role="img" aria-label="pin">&#128205;</span>

export default InputLocation;
