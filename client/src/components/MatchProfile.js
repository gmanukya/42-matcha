import React from 'react';
import moment from 'moment';
import Dropdown from 'rc-dropdown';

import MatchChat from './MatchChat';

const Geolocator = require('../modules/Geolocator');

class MatchProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			chat: false,
			popularity: 0,
			profile_pic: "",
			pictures: [],
			first_name: "",
			last_name: "",
			age: null,
			gender: 0,
			distance: null,
			interests: [],
			bio: "",
			report: false,
			finishedLoading: false
		};
		this.changeToChat = this.changeToChat.bind(this);
		this.likeClick = this.likeClick.bind(this);
		this.reportUser = this.reportUser.bind(this);
		this.blockUser = this.blockUser.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState !== this.state) {
			this.getLike();
		}
		if (prevProps.login !== this.props.login || prevProps.connectedUser !== this.props.connectedUser) {
			fetch('/match/getProfileInfos', {
				credentials: 'include',
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({login: this.props.login})
			}).then(res => {
				if (res.headers.get("content-type").indexOf("application/json") !== -1) {
					res.json().then((data) => {
						const age = moment()
						.diff(moment(data.profileInfos.birth_year + '/' +
						data.profileInfos.birth_month + '/' +
						data.profileInfos.birth_day, "YYYY-MM-DD"), 'years');
						Geolocator.calcDistance(
							data.profileInfos.my_location_lat,
							data.profileInfos.my_location_lon,
							data.profileInfos.user_location_lat,
							data.profileInfos.user_location_lon,
							(distance) => {
								const chat = prevProps.login === this.props.login ? this.state.chat : false;
								if (!this.state.finishedLoading) {
									this.props.socket.on('like', data => {
										this.setState({likedBy: data.likedBy})
									});
								}
								this.setState({
									chat: chat,
									popularity: data.profileInfos.popularity,
									login: data.profileInfos.login,
									profile_pic: data.profileInfos.profile_pic,
									pictures: data.profileInfos.pictures,
									first_name: data.profileInfos.first_name,
									last_name: data.profileInfos.last_name,
									age: age,
									gender: data.profileInfos.gender,
									distance: distance < 1 ? 1 : parseInt(distance, 10),
									last_seen: data.profileInfos.last_seen,
									interests: data.profileInfos.interests,
									bio: data.profileInfos.bio,
									report: false,
									finishedLoading: true
								});
							}
						);
					});
				}
			});
		}
	}

	getLike() {
		fetch('/match/getLike', {
			credentials: 'include',
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({login: this.props.login})
		}).then(res => {
			if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then(data => {
					this.setState((prevState, props) => {
						if (prevState.liked !== data.liked || prevState.likedBy !== data.likedBy) {
							return {liked: data.liked, likedBy: data.likedBy};
						}
					});
				})
			}
		});
	}

	likeClick() {
		this.setState({liked: this.state.liked ? false : true}, () => {
			fetch('/match/likeProfile', {
				credentials: 'include',
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					login: this.props.login
				})
			});
			this.props.socket.emit('like', {
				login: this.props.login,
				liked: this.state.liked
			});
			this.props.onLike(this.state.login, this.state.liked);
		});
	}

	reportUser() {
		fetch('/match/reportUser', {
			credentials: 'include',
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({login: this.props.login})
		});
		this.setState({report:true});
	}

	blockUser() {
		fetch('/match/blockUser', {
			credentials: 'include',
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({login: this.props.login})
		});
		window.location.reload();
	}

	changeToChat(bool) {
		this.setState({chat: bool})
	}

	render() {
		var popularity = [];
		for(var i = 1; i < 6 ; i++) {
			if(i > this.state.popularity) {
				popularity.push(<i key={i} className="far fa-star"></i>);
			}
			else {
				popularity.push(<i key={i} className="fas fa-star"></i>);
			}
		}

		const minutes = Math.floor((new Date() - new Date(this.state.last_seen)) / 1000 / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		return (
			<div className="matchProfile inline">
				{
					this.state.finishedLoading === true ?
					this.state.chat ?
					<MatchChat
						contact={this.state.login}
						changeToChat={this.changeToChat}
						socket={this.props.socket}
						/>
					:
					<div className="matchProfileContainer">
						{
							this.state.liked && this.state.likedBy ?
							<div className="arrow toChat" onClick={() => this.changeToChat(true)}><i className="fas fa-angle-right"></i></div>
							:
							null
						}
						<div className="inline majorPicContainer">
							{this.state.profile_pic ? <img alt="" className="majorPic" src={this.state.profile_pic}/> : null}
						</div>
						<div className="inline majorPicContainer majorMinorPicContainer">
							{
								this.state.pictures.map(
									(picture, index) =>
									<div key={index} className="inline minorPicContainer">
										<img alt={index} className="minorPic" src={picture}/>
									</div>
								)
							}
						</div>
						<div className="matchProfileText">
							<div>
								{this.state.gender === 1 ? <i className="fas fa-mars fontBig"></i> : <i className="fas fa-venus fontBig"></i>}
								<span className="fontBig spaceLeft">
									<b>{this.state.first_name} {this.state.last_name} {this.props.connectedUser[this.state.login] ? <span className="greenFont">&bull;</span> : null}</b>
								</span>
								<button className="spaceLeft click" onClick={this.likeClick}>
									{
										this.state.liked ?
										(this.state.likedBy ? <span><i className="fas fa-heart"></i> It's a match !</span> : <span><i className="fas fa-thumbs-up"></i> Liked</span>)
										:
										(this.state.likedBy ? <span><i className="far fa-heart"></i> {this.state.gender === 1 ? "He" : "She"} likes you</span> : <span><i className="far fa-thumbs-up"></i> Like</span>)
									}
								</button>
								{this.state.liked && this.state.likedBy ? <button className="spaceLeft click" onClick={() => this.changeToChat(true)}><i className="fab fa-facebook-messenger"></i> Chat</button> : null}
								<Dropdown
									trigger={['click']}
									overlay={
										<div>
											{this.state.report ? <button className="redBack">User reported <i className="fas fa-check"></i></button> : <button className="redBack" onClick={this.reportUser}><i className="far fa-flag"></i> Report this user</button>}
											<button className="redBack" onClick={this.blockUser}><i className="fas fa-ban"></i> Block this user</button>
										</div>
									}
									animation="slide-up"
									>
									<button className="spaceLeft click"><i className="fas fa-ellipsis-h"></i></button>
								</Dropdown>
							</div>
							<div className="greyFont">
								{popularity} - {Number.isInteger(this.state.age) ? this.state.age + " years old -": null} {!this.props.locationIsPrivate && Number.isInteger(this.state.distance) ? this.state.distance + ' km away' : null}
								{this.props.connectedUser[this.state.login] ? null : <span> - Last seen {minutes < 1 ? "few seconds" :hours < 1 ? minutes + " min" : hours < 24 ? hours + " h" : days + " days"} ago</span>}
							</div>
							<br/>
							<div>
								{
									this.state.interests.map(
										(interest, index) =>
										<span key={index}>
											<button className="noClick">
												<i>#{interest}</i>
												&nbsp;
											</button>
										</span>
									)
								}
							</div>
							<div className="lign"></div>
							<div className="matchProfileBio">
								{this.state.bio}
							</div>
						</div>
					</div>
					:
					null
				}
			</div>
		);
	}
}

export default MatchProfile;
