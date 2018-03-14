import React from 'react';

import MatchResults from './MatchResults';
import MatchProfile from './MatchProfile';

class Match extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			login: this.props.location.pathname && this.props.location.pathname.substr(1) !== localStorage.getItem('login') ? this.props.location.pathname.substr(1) : ""
		};
		this.userClicked = this.userClicked.bind(this);
		this.userLiked = this.userLiked.bind(this);
	}

	componentDidMount() {
		fetch('/isLocationPrivate', {
			credentials: 'include',
			method: 'get'
		}).then(res => {
			if (res.status === 202) {
				this.setState({
					locationIsPrivate: false,
					finishedLoading: true
				})
			}
			else if (res.status === 200) {
				this.setState({
					locationIsPrivate: true,
					finishedLoading: true
				})
			}
		})
	}

	userClicked(login) {
		this.setState({login});
		window.history.replaceState({} , "", login);
	}

	userLiked(login, liked) {
		this.setState({
			like: {
				login,
				liked
			}
		});
	}

	render() {
		return (
			<div>
				{this.state.finishedLoading ?
					<div>
						<MatchResults onClick={this.userClicked} locationIsPrivate={this.state.locationIsPrivate} like={this.state.like} connectedUser={this.props.connectedUser} socket={this.props.socket}/>
						<MatchProfile login={this.state.login} locationIsPrivate={this.state.locationIsPrivate} onLike={this.userLiked} connectedUser={this.props.connectedUser} socket={this.props.socket} />
					</div>
					: null }
				</div>
			);
		}
	}

	export default Match;
