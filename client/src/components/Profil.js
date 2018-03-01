import React from 'react';
import moment from 'moment';

import Errors from './Errors';
import Logout from './Logout';
import ImageUpload from './ImageUpload';
import Input from './Input';
import InputPassword from './InputPassword';
import InputDate from './InputDate';
import InputGender from './InputGender';
import InputSexualOrientation from './InputSexualOrientation';
import InputLocation from './InputLocation';
import InputInterests from './InputInterests';
import InputBio from './InputBio';

const Geolocator = require('../modules/Geolocator');

class Profil extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			profile_pic: "",
			first_name: "",
			last_name: "",
			email: "",
			password: {
				old: "",
				new: ""
			},
			birth_date: {
				day: 0,
				month: 0,
				year: 0
			},
			gender: "",
			sexual_orientation: [],
			location: {
				address: "",
				latitude: "",
				longitude: ""
			},
			interests: [],
			bio: "",
			errors: [],
			finishedLoading: false,
			profileIncompleted: false,
			underage: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		fetch('/profile', {
			method: 'get',
			credentials: 'include'
		})
		.then(res => {

			if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then(
					data => {
						if (data.location.latitude && data.location.longitude) {
							console.log(0);
							if (data.location.private) {
								this.setState({
									...data,
									finishedLoading: true,
									location: {
										address: "Location blocked"
									}
								});
							}
							else {
								console.log(1);
								console.log(data.location.latitude);
								console.log(data.location.longitude);
								Geolocator.coordsToAddress(data.location.latitude, data.location.longitude, (location) => {
									console.log(2);
									this.setState({
										...data,
										finishedLoading: true,
										location: {
											address: location.formattedAddress
										}
									});
								});
							}
						}
						else {
							this.setState({
								...data,
								finishedLoading: true
							});
						}
					}
				);
			}
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.profile_pic && this.state.first_name && this.state.last_name && this.state.email && this.state.birth_date.day && this.state.birth_date.month && this.state.birth_date.year && this.state.gender && (this.state.sexual_orientation.includes("M") || this.state.sexual_orientation.includes("F")) && this.state.location.address && this.state.bio) {
			if (this.state.profileIncompleted) {
				this.setState({
					profileIncompleted: false
				});
			}
		}
		else if (!this.state.profileIncompleted) {
			this.setState({
				profileIncompleted: true
			});
		}
		const age = moment().diff(moment(this.state.birth_date.year + '/' + this.state.birth_date.month + '/' + this.state.birth_date.day, "YYYY-MM-DD"), 'years');
		if (age > 17 || isNaN(age)) {
			if (this.state.underage) {
				this.setState({
					underage: false
				});
			}
		}
		else if (!this.state.underage){
			this.setState({
				underage: true
			});
		}
	}

	handleChange(name, value) {
		this.setState({
			[name]: value,
			errors: []
		});
	}

	handleSubmit(backFile, body) {
		fetch(backFile, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})
		.then(res => {
			if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then(errors => this.setState({errors: errors.errors }));
			}
		});
	}

	render() {
		return (
			<div className="profile spaceUp">
				{
					this.state.finishedLoading === true ?
					<div>
						<div className="marginAuto alignCenter">
							<h2>{localStorage.getItem('login')} - SCORE DE POPULARITE</h2>
							<div className="spaceUp red">
								{!this.state.profileIncompleted && !this.state.underage ? <button><a href="/">Start Matching</a></button> : null}
								<div className="inline">
									<button><Logout /></button>
								</div>
							</div>
							{this.state.profileIncompleted ? <button className='redBack'>Fill your informations before matching</button> : null}
							{this.state.underage ? <button className='redBack'>Matcha is only available to 18+</button> : null}
						</div>
						<Errors errors={this.state.errors}/>
						<ImageUpload
							onChange={this.handleChange}
							/>
						<br/>
						<div className="inline half">
							<b>First Name</b>
							<br/>
							<Input type="text"
								name="first_name"
								placeholder="First Name"
								value={this.state.first_name}
								onChange={this.handleChange}
								onSubmit={this.handleSubmit}
								blurOnEnter
								submitOnBlur
								maxLength={20}
								forbiddenChars={["[^a-zà-ÿ ]", "gi"]}
								/>
						</div>
						<div className="inline half spaceLeft">
							<b>Last Name</b>
							<br/>
							<Input type="text"
								name="last_name"
								placeholder="Last Name"
								value={this.state.last_name}
								onChange={this.handleChange}
								onSubmit={this.handleSubmit}
								blurOnEnter
								submitOnBlur
								maxLength={20}
								forbiddenChars={["[^a-zà-ÿ ]", "gi"]}
								/>
						</div>
						<div className="lign"></div>
						<b>Email</b>
						<br/>
						<Input
							type="text"
							name="email"
							placeholder="Email"
							value={this.state.email}
							onChange={this.handleChange}
							onSubmit={this.handleSubmit}
							blurOnEnter
							submitOnBlur
							maxLength={50}
							forbiddenChars={["[^a-zà-ÿ0-9-_@.]", "gi"]}
							/>
						<div className="lign"></div>
						<InputPassword
							value={this.state.password}
							onChange={this.handleChange}
							onSubmit={this.handleSubmit}
							/>
						<div className="lign"></div>
						<div className="inline third">
							<InputDate
								name="birth_date"
								date={this.state.birth_date}
								onChange={this.handleChange}
								onSubmit={this.handleSubmit}
								submitOnChange
								/>
						</div>
						<div className="inline third">
							<InputGender
								checked={this.state.gender}
								onChange={this.handleChange}
								onSubmit={this.handleSubmit}
								/>
						</div>
						<div className="inline third">
							<InputSexualOrientation
								checked={this.state.sexual_orientation}
								onChange={this.handleChange}
								onSubmit={this.handleSubmit}
								/>
						</div>
						<div className="lign"></div>
						<InputLocation
							value={this.state.location}
							onChange={this.handleChange}
							onSubmit={this.handleSubmit}
							/>
						<div className="lign"></div>
						<InputInterests
							value={this.state.interests}
							onChange={this.handleChange}
							onSubmit={this.handleSubmit}
							/>
						<div className="lign"></div>
						<InputBio
							value={this.state.bio}
							onChange={this.handleChange}
							onSubmit={this.handleSubmit}
							/>
					</div>
					: null
				}
			</div>
		);
	}
}

export default Profil;
