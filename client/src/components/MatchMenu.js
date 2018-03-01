import React from 'react';

import Logout from './Logout';

class MatchMenu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			profilePic: ""
		};
	}

	componentDidMount() {
		fetch('/update/getUploaded', {
			credentials: 'include',
			method: 'get'
		}).then(res => {
			if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then((data) => {
					this.setState({profilePic: data.profilePic});
				});
			}
		})
	}

	render() {
		return (
			<div className="matchMenu">
				<a href="profil">
					<div className="menuPictureContainer circle inline">
						{this.state.profilePic ? <img alt="" className="menuPicture" src={this.state.profilePic}/> : null}
					</div>
					<div className="menuText inline"><b>{localStorage.getItem('login')}</b> <i className="fas fa-cog"></i></div>
				</a>
				<div className="menuLogout inline floatRight">
					<Logout />
				</div>
			</div>
		);
	}
}

export default MatchMenu;
