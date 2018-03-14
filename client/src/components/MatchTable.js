import React from 'react';

class MatchTable extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userClicked: ""
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(login) {
		this.props.onClick(login);
		this.setState({userClicked: login}, () => {
			fetch('/match/addProfileView', {
				credentials: 'include',
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({login: this.state.userClicked, scoreToAdd: 1})
			})
		});
	}

	render() {
		return (
			<div className="matchResultsTable">
				{
					this.props.results.map((user, index) =>
					<div key={index}>
						<div key={index} id={user.login === this.state.userClicked ? 'userClicked' : null} className="matchTableUser" onClick={() => this.handleClick(user.login)}>
							<div className="tablePictureContainer circle inline">
								<img alt="" className="menuPicture" src={user.profilePic}/>
							</div>
							<div className="tableText">
								<div className="fontMedium">
									{
										user.gender === 1 ?
										<i className="fas fa-mars"></i>
										:
										<i className="fas fa-venus"></i>
									} <b>{user.first_name} {this.props.connectedUser[user.login] ? <span className="greenFont">&bull;</span> : null}</b>
									<span className={user.likedYou ? "spaceLeft redFont" : "spaceLeft greenFont"}>
										{
											user.youLiked ?
											(user.likedYou ? <span><i className="fas fa-heart"></i></span> : <span><i className="fas fa-thumbs-up"></i></span>)
											:
											(user.likedYou ? <span><i className="far fa-heart"></i></span> : null)
										}
									</span>
								</div>
								{user.login}
								<div className="greyFont spaceUp inline">{user.age} years old{this.props.locationIsPrivate ? null : " - " + user.distance + " km"}</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default MatchTable;
