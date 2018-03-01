import React from 'react';
import moment from 'moment';

const Geolocator = require('../modules/Geolocator');


class MatchProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			profile_pic: "",
			pictures: [],
			first_name: "",
			last_name: "",
			age: null,
			gender: 0,
			distance: null,
			interests: [],
			bio: "",
			finishedLoading: false
		};

		this.likeClick = this.likeClick.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState !== this.state) {
			console.log(this.state);
			this.getLike();
		}

		if (prevProps.login !== this.props.login) {
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
								this.setState({
									profile_pic: data.profileInfos.profile_pic,
									pictures: data.profileInfos.pictures,
									first_name: data.profileInfos.first_name,
									last_name: data.profileInfos.last_name,
									age: age,
									gender: data.profileInfos.gender,
									distance: parseInt(distance, 10),
									interests: data.profileInfos.interests,
									bio: data.profileInfos.bio,
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
							console.log(data);
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
				body: JSON.stringify({login: this.props.login})
			});
		});
	}

	render() {
		return (
			<div className="matchProfile inline">
				{
					this.state.finishedLoading === true ?
					<div className="matchProfileContainer">
						<div className="inline majorPicContainer">
							{this.state.profile_pic ? <img alt="" className="majorPic" src={this.state.profile_pic}/> : null}
						</div>
						<div className="inline majorPicContainer">
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
							<h1>
								<button className="emptyBack" onClick={this.likeClick}>
									{this.state.liked ?
										this.state.likedBy ? <i className="fas fa-heart"></i> : <i className="fas fa-thumbs-up"></i>
									: 
										this.state.likedBy ? <i className="far fa-heart"></i> : <i className="far fa-thumbs-up"></i>
									}
								</button>

								{this.state.gender === 1 ? <i className="fas fa-mars"></i> : <i className="fas fa-venus"></i>} {this.state.first_name} {this.state.last_name}
								{Number.isInteger(this.state.age) ? ', ' + this.state.age : null}
							</h1>
							<div className="greyFont">
								{!this.props.locationIsPrivate && Number.isInteger(this.state.distance) ? this.state.distance + ' km away' : null}
							</div>
							<br/>
							<div>
								{
									this.state.interests.map(
										(interest, index) =>
										<span key={index}>
											<button>
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
					: null
				}
			</div>
		);
	}
}

export default MatchProfile;
