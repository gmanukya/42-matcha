import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import io from 'socket.io-client'
import moment from 'moment';
import 'rc-dropdown/assets/index.css';

import Match from './Match';
import Profil from './Profil';
import Signup from './Signup';
import Login from './Login';
import ForgotPassword from './ForgotPassword';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			login: "",
			connectedUser: {},
			profile: false,
			finshedLoading: false
		};
	}

	componentDidMount() {
		fetch('/auth', {
			method: 'get',
			credentials: 'include'
		})
		.then(res => {
			if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then(data => {
					localStorage.setItem('login', data.login);
					if (data.login) {
						this.socket = io('localhost:3001');
						this.socket.emit('login', data.login);
						this.socket.on('connectedUser', (connectedUser) => {
							this.setState({connectedUser})
						})
					}
					if (data.profile && moment().diff(moment(data.birth_date.year + '/' + data.birth_date.month + '/' + data.birth_date.day, "YYYY-MM-DD"), 'years') > 17) {
						this.setState({
							login: data.login,
							profile: true,
							finshedLoading: true
						})
					}
					else {
						this.setState({
							login: data.login,
							profile: false,
							finshedLoading: true
						})
					}
				});
			}
		});
	}

	render() {
		return (
			<div>
				{this.state.finshedLoading === true ?
					<Switch>
						{localStorage.getItem('login') ? [
							<Route exact path='/profil' key="match" render={(props) => (
									<Profil {...props} />
								)}
								/>,
							<Route exact path='/:user' key="match" render={(props) => (
									this.state.profile ?
									<Match {...props} connectedUser={this.state.connectedUser} socket={this.socket}/>
									:
									<Profil {...props} />
								)}
								/>,
							<Route key="notFound" render={(props) => (
									this.state.profile ?
									<Match {...props} connectedUser={this.state.connectedUser} socket={this.socket}/>
									:
									<Profil {...props} />
								)}
								/>,
						] :
						[
							<Route exact path='/' key="signup" component={Signup}/>,
							<Route exact path='/login' key="login" component={Login}/>,
							<Route exact path='/forgotPassword' key="forgotPassword" component={ForgotPassword}/>,
							<Route key="NotFound" component={Signup}/>
						]}
					</Switch>
					: null}
				</div>
			);
		}
	}

	export default App;
