import React from 'react';

import Input from './Input';

class SearchDistance extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(name, value) {
		if (this.props.onChange) {
			if (name === 'youLiked') {
				value = this.props.youLiked ? 0 : 1;
				this.props.onChange(name, value);
				localStorage.setItem('youLiked', value);
			}
			else if (name === 'likedYou') {
				value = this.props.likedYou ? 0 : 1;
				this.props.onChange(name, value);
				localStorage.setItem('likedYou', value);
			}
			else if (name === 'lookedYou') {
				value = this.props.lookedYou ? 0 : 1;
				this.props.onChange(name, value);
				localStorage.setItem('lookedYou', value);
			}
		}
	}

	render() {
		return (
			<div>
				<b>People : </b>
				<div className="searchLikes inline spaceRight noWrap">
					<Input
						id="youLiked"
						type="checkbox"
						name="youLiked"
						checked={this.props.youLiked}
						onChange={this.handleChange}
						/>
					<label htmlFor="youLiked"> you like</label>
				</div>
				<div className="searchLikes inline spaceRight noWrap">
					<Input
						id="likedYou"
						type="checkbox"
						name="likedYou"
						checked={this.props.likedYou}
						onChange={this.handleChange}
						/>
					<label htmlFor="likedYou"> liked you</label>
				</div>
				<div className="searchLikes inline noWrap">
					<Input
						id="lookedYou"
						type="checkbox"
						name="lookedYou"
						checked={this.props.lookedYou}
						onChange={this.handleChange}
						/>
					<label htmlFor="lookedYou"> looked you</label>
				</div>
			</div>
		);
	}
}

export default SearchDistance;
