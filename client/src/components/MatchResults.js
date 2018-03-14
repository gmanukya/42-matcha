import React from 'react';

import MatchMenu from './MatchMenu';
import MatchSearch from './MatchSearch';
import MatchTable from './MatchTable';


class MatchResults extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			results: [],
			finishedLoading: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps !== this.props ) {
			if (prevProps.like !== this.props.like) {
				var results = this.state.results;
				results.forEach((value, key) => {
					if (this.props.like.login === value.login) {
						results[key].youLiked = results[key].youLiked ? false : true;
						this.setState({results})
					}
				});
			}
		}
	}

	handleSubmit(results) {
		if (!this.state.finishedLoading) {
			this.props.socket.on('like', data => {
				var results = this.state.results;
				results.forEach((value, key) => {
					if (data.login === value.login) {
						results[key].likedYou = data.liked;
						this.setState({results})
					}
				});
			})
		}
		this.setState({
			results: results,
			finishedLoading: true
		});
	}

	render() {
		return (
			<div className="matchResults">
				<div>
					<MatchMenu socket={this.props.socket}/>
					<MatchSearch onSubmit={this.handleSubmit} locationIsPrivate={this.props.locationIsPrivate}/>
					{
						this.state.finishedLoading ?
						<MatchTable results={this.state.results} onClick={this.props.onClick} locationIsPrivate={this.props.locationIsPrivate} connectedUser={this.props.connectedUser}/>
						:
						null
					}
				</div>
			</div>
		);
	}
}

export default MatchResults;
