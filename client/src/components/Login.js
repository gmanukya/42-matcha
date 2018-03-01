import React, { Component } from 'react';

import Form from './Form';
import Input from './Input';
import App from './App';

import Errors from './Errors';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			login: "",
			password: "",
			connected: false,
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
		fetch('/login', {
			method: 'post',
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				login: this.state.login,
				password: this.state.password,
			})
		})
		.then(res => {
			if (res.status === 202) {
				res.json().then(data => {
					localStorage.setItem('login', data.login);
						this.setState({ connected: true });
				});
			}
			else if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then(data => this.setState({password: "", errors: data.errors }));
			}
		})
	}

	render() {

		if (this.state.connected) {
			return <App />

		}
		return (
			<div className="login">
				<h1>Log in</h1>
				<div className="lign"></div>
				<a href="/">Don't have an account ?</a>
				<Errors errors={this.state.errors}/>
				<Form onSubmit={this.handleSubmit}>
					<div className="full">
						<Input
							type="text"
							name="login"
							placeholder="Login"
							value={this.state.login}
							onChange={this.handleChange}
							maxLength={50}
							/>
					</div>
					<div className="full">
						<Input
							type="password"
							name="password"
							placeholder="Password"
							value={this.state.password}
							onChange={this.handleChange}
							maxLength={20}
							/>
					</div>
					<div className="inline">
					<button>Log in</button>
					</div>
					<div className="inline spaceLeft">
						<a href="/forgotPassword">Forgot password ?</a>
					</div>
				</Form>
			</div>
		);
	}
}

export default Login;
