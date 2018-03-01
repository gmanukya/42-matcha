import React from 'react';

import MatchResults from './MatchResults';
import MatchProfile from './MatchProfile';

class Match extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			login: ""
		};
		this.userClicked = this.userClicked.bind(this);
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
	}

	render() {
		return (
			<div>
				{this.state.finishedLoading ?
				<div>
				<MatchResults onClick={this.userClicked} locationIsPrivate={this.state.locationIsPrivate}/>
				<MatchProfile login={this.state.login} locationIsPrivate={this.state.locationIsPrivate}/>
				</div>
				: null }
			</div>
		);
	}
}

export default Match;
