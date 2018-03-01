import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import moment from 'moment';

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
						<Route exact path='/' key="match" component={this.state.profile ? Match : Profil}/>,
						<Route exact path='/profil' key="profil" component={Profil}/>,
						<Route key="NotFound" component={this.state.profile ? Match : Profil}/>
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
