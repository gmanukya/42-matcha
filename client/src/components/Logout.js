import React from 'react';

class Logout extends React.Component {

	logout() {
		fetch('/logout', {
			method: 'get',
			credentials: 'include'
		})
		.then(() => {
			localStorage.removeItem('youLiked');
			localStorage.removeItem('likedYou');
			localStorage.removeItem('lookedYou');
			localStorage.removeItem('login')
			localStorage.removeItem('ageMin');
			localStorage.removeItem('ageMax');
			localStorage.removeItem('popularityMin');
			localStorage.removeItem('popularityMax');
			localStorage.removeItem('distanceMax');
			localStorage.removeItem('interest0');
			localStorage.removeItem('interest1');
			localStorage.removeItem('interest2');
			localStorage.removeItem('orderBy');
			window.location.replace('login')
		});
	}

	render() {
		return (
			<span className="pointer" onClick={this.logout}>Log out</span>
		);
	}
}

export default Logout;
