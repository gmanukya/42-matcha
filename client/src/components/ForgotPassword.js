import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import Form from './Form';
import Input from './Input';

import Errors from './Errors';

class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			login: "",
			errors: [],
			emailSent: false
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
		fetch('/forgotPassword', {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				login: this.state.login,
			})
		})
		.then(res => {
			if (res.status === 202) {
				this.setState({ connected: true });
			}
			else if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then(data => this.setState({errors: data.errors }));
			}
		})
	}

	render() {

		if (this.state.connected) {
			return <Redirect to="/login" />;
		}

		return (
			<div className="login">
				<h1>Forgot Account ?</h1>
				<div className="lign"></div>
				<a href="/login">Back to log in</a>
				<Form method="post" onSubmit={this.handleSubmit}>
					<Errors errors={this.state.errors}/>
					<Input type="text" name="login" placeholder="Login or Email" value={this.state.login} onChange={this.handleChange}/>
					<button>Search</button>
				</Form>
			</div>
		);
	}
}

export default ForgotPassword;
