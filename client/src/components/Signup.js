import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Form from './Form';
import Input from './Input';
import Errors from './Errors';

class Signup extends Component {

	constructor(props) {
		super(props);
		this.state = {
			first_name: "",
			last_name: "",
			login: "",
			email: "",
			password: "",
			signedIn: false,
			errors: []
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(name, value) {
		this.setState({
			[name]: value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		fetch('/signup', {
			method: 'post',
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				first_name: this.state.first_name,
				last_name: this.state.last_name,
				login: this.state.login,
				email: this.state.email,
				password: this.state.password
			})
		})
		.then(res => {
			if (res.status === 201) {
				localStorage.setItem('login', this.state.login);
				this.setState({
					signedIn: true
				});
			}
			else if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then(data => this.setState({password: "", errors: data.errors }));
			}
		});
	}

	render() {

		if (this.state.signedIn) {
			return <Redirect to="/" />;
		}
		return (
			<div className="signup">
				<h1>Signup</h1>
				<div className="lign"></div>
				<a href="login">Already a member ?</a>
				<div>
					<Form onSubmit={this.handleSubmit}>
						<Errors errors={this.state.errors}/>
						<div className="inline half">
							<Input
								type="text"
								name="first_name"
								placeholder="First Name"
								value={this.state.first_name}
								onChange={this.handleChange}
								maxLength={20}
								/>
						</div>
						<div className="inline half spaceLeft">
							<Input
								type="text"
								name="last_name"
								placeholder="Last Name"
								value={this.state.last_name}
								onChange={this.handleChange}
								maxLength={20}
								/>
						</div>
						<div className="inline half">
							<Input type="text"
								name="login"
								placeholder="Login"
								value={this.state.login}
								onChange={this.handleChange}
								maxLength={12}
								/>
						</div>
						<div className="inline half spaceLeft">
							<Input
								type="text"
								name="email"
								placeholder="Email"
								value={this.state.email}
								onChange={this.handleChange}
								maxLength={50}
								/>
						</div>
						<div className="inline half">
							<Input
								type="password"
								name="password"
								placeholder="Password"
								value={this.state.password}
								onChange={this.handleChange}
								maxLength={20}
								/>
						</div>
						<div className="inline spaceLeft">
						<button>Create Account</button>
						</div>
					</Form>
				</div>
			</div>
		);
	}
}

export default Signup;
