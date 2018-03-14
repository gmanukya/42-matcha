import React from 'react';
import Dropdown from 'rc-dropdown';

import Logout from './Logout';

class MatchMenu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			profilePic: "",
			notifications: [
			],
			newNotifications: 0,
			finishedLoading: false
		};
		this.showNotifications = this.showNotifications.bind(this);
		this.addNotification = this.addNotification.bind(this);
	}

	componentDidMount() {
		fetch('/match/getNotifications', {
			credentials: 'include',
			method: 'get'
		}).then(res => {
			if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then((notifications) => {
					fetch('/update/getUploaded', {
						credentials: 'include',
						method: 'get'
					}).then(res => {
						if (res.headers.get("content-type").indexOf("application/json") !== -1) {
							res.json().then((data) => {
								this.setState({
									profilePic: data.profilePic,
									notifications: notifications.results,
									newNotifications: notifications.results.filter(x => !x.seen).length,
									finishedLoading: true
								});
								this.props.socket.on('messageNotif', data => {
									this.addNotification(data)
								});
								this.props.socket.on('like', data => {
									if (data.liked) {
										this.addNotification(data)
									}
								});
							});
						}
					});
				});
			}
		})
	}

	showNotifications() {
		fetch('/match/seeNotifications', {
			method: 'post',
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				ids: this.state.notifications.map(e => !e.seen ? e.id : null).filter(e => e !== null)
			})
		});
		var notifications = this.state.notifications.map(notification => {
			return {...notification, seen: true}
		});
		this.setState({
			notifications,
			newNotifications: 0
		})
	}

	addNotification(data) {
			var notifications = this.state.notifications;
			var newNotifications = this.state.newNotifications + 1;
			notifications.forEach((value, key) => {
				if (value.type === data.notifType && value.user === data.login) {
					notifications.splice(key, 1);
					if (!value.seen) {
						newNotifications = newNotifications - 1;
					}
				}
			})
			this.state.notifications.unshift({
				id: data.notifId,
				type: data.notifType,
				user: data.login,
				seen: false,
				new: true
			});
			this.setState({
				notifications,
				newNotifications
			});
	}

	render() {
		return (
			<div className="matchMenu">
				{
					this.state.finishedLoading ?
				<div>
					<a href="profil">
					<div className="menuPictureContainer circle inline">
						{this.state.profilePic ? <img alt="" className="menuPicture" src={this.state.profilePic}/> : null}
					</div>
					<div className="menuText inline">
						<b>{localStorage.getItem('login')}</b> <i className="fas fa-cog"></i>
					</div>
				</a>
				<div className="inline spaceLeft menuNotificationLogo">
					<Dropdown
						trigger={['click']}
						overlay={
							<div className="menuNotifications noWrap">
								{
									this.state.notifications.map((notification, index) =>
									<a key={index} href={notification.user}>
										{
											notification.type === 1 ?
											<div className={!notification.new ? "menuNotification" : "menuNotification lightGreenBack"}><i className="far fa-thumbs-up"></i> <b>{notification.user}</b> likes your profile</div>
											:
											<div className={!notification.new ? "menuNotification" : "menuNotification lightGreenBack"}><i className="far fa-comment"></i> <b>{notification.user}</b> sent you a message</div>
										}
									</a>
								)}
							</div>
						}
						animation="slide-up"
						>
						<div>
							<button className={this.state.newNotifications ? "redBack" : null} onClick={this.showNotifications}><i className="far fa-bell"></i> <b>{this.state.newNotifications ? this.state.newNotifications : null}</b></button>
						</div>
					</Dropdown>
				</div>
				<div className="menuLogout inline floatRight">
					<Logout />
				</div>
				</div>
				:
				null
			}
			</div>
		);
	}
}

export default MatchMenu;
