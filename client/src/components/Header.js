import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from './NotFound';

class Header extends Component {

	logout (event) {
		fetch('/logout', {
			method: 'get',
			credentials: 'include'
		})
		.then(
			localStorage.removeItem('login')
		);
	}

	render() {
		if (localStorage.getItem('login')) {
			return (

				<Switch>

					<Route
						exact path='/'
						key="match"
						render={(props) => (
							<div>
								<ul>
									<li><a href="/profil">My Profile</a></li>
									<li><a href="/login" onClick={this.logout}>Log out</a></li>
								</ul>
							</div>
						)}/>

						<Route
							path='/profil'
							key="profil"
							render={(props) => (
								<div>
									<ul>
										<li><a href="/">Search</a></li>
										<li><a href="/login" onClick={this.logout}>Log out</a></li>
									</ul>
								</div>
							)}/>

							<Route component={NotFound}/>
						</Switch>
					);
				}
				else {
					return null;
				}
			}
		}

		export default Header;
