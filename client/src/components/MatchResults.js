import React from 'react';

import MatchMenu from './MatchMenu';
import MatchSearch from './MatchSearch';
import MatchTable from './MatchTable';


class MatchResults extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			results: [],
			finishedLoading: true
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(results) {
		this.setState({
			results: results,
			finishedLoading: true
		});
	}

	// componentDidMount() {
	// 	fetch('/match/getAllCompleteProfiles', {
	// 		method: 'post',
	// 		credentials: 'include',
	// 		headers: {
	// 			'Accept': 'application/json, text/plain, */*',
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			login: this.state.login,
	// 			password: this.state.password,
	// 		})
	// 	})
	// 	.then(res => {
	// 		if (res.headers.get("content-type").indexOf("application/json") !== -1) {
	// 			res.json().then((data) => {
	// 				this.setState({
	// 					results: data.results,
	// 					finishedLoading: true
	// 				});
	// 			});
	// 		}
	// 	})
	// }

	render() {
		return (
			<div className="matchResults">
				{this.state.finishedLoading ?
					<div>
						<MatchMenu />
						<MatchSearch onSubmit={this.handleSubmit} locationIsPrivate={this.props.locationIsPrivate}/>
						<MatchTable results={this.state.results} onClick={this.props.onClick} locationIsPrivate={this.props.locationIsPrivate}/>
					</div>
					: null}
				</div>
			);
		}
	}

	export default MatchResults;
