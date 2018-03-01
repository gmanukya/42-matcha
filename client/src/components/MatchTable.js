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
								<h3>{user.gender === 1 ? <i className="fas fa-mars"></i> : <i className="fas fa-venus"></i>} {user.first_name}</h3>
								<br/>
								<span className="greyFont">{user.age} years old{this.props.locationIsPrivate ? null : " - " + user.distance + " km"}</span>
							</div>
						</div>
					</div>
				)
			}
		</div>
	);
}
}

export default MatchTable;
