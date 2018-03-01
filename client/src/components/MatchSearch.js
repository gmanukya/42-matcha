import React from 'react';
import 'rc-slider/assets/index.css';

import SearchAge from './SearchAge';
import SearchPopularity from './SearchPopularity';
import SearchDistance from './SearchDistance';
import SearchInterests from './SearchInterests';
import SearchOrderBy from './SearchOrderBy';

class MatchSearch extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			age: {
				min: localStorage.getItem('ageMin') > 17 && localStorage.getItem('ageMin') < 56 ? parseInt(localStorage.getItem('ageMin'), 10) : 18,
				max: localStorage.getItem('ageMax') > 17 && localStorage.getItem('ageMax') < 56 ? parseInt(localStorage.getItem('ageMax'), 10) : 55,
			},
			popularity: {
				min: localStorage.getItem('popularityMin') > 0 && localStorage.getItem('popularityMin') < 6 ? parseInt(localStorage.getItem('popularityMin'), 10) : 1,
				max: localStorage.getItem('popularityMax')  > 0 && localStorage.getItem('popularityMax')  < 6 ? parseInt(localStorage.getItem('popularityMax'), 10) : 5
			},
			distanceMax: localStorage.getItem('distanceMax') < 161 && localStorage.getItem('distanceMax') > 1 ? parseInt(localStorage.getItem('distanceMax'), 10) : 50,
			interests: [
				localStorage.getItem('interest0') && /^([a-z]{1,12})$/.test(localStorage.getItem('interest0')) ? localStorage.getItem('interest0') : "",
				localStorage.getItem('interest1') && /^([a-z]{1,12})$/.test(localStorage.getItem('interest1')) ? localStorage.getItem('interest1') : "",
				localStorage.getItem('interest2') && /^([a-z]{1,12})$/.test(localStorage.getItem('interest2')) ? localStorage.getItem('interest2') : "",
				localStorage.getItem('interest3') && /^([a-z]{1,12})$/.test(localStorage.getItem('interest3')) ? localStorage.getItem('interest3') : "",
				localStorage.getItem('interest4') && /^([a-z]{1,12})$/.test(localStorage.getItem('interest4')) ? localStorage.getItem('interest4') : ""
			].filter(e => String(e).trim()),
			orderBy: localStorage.getItem('orderBy') ? localStorage.getItem('orderBy') : 0,
			finishedLoading: true
		};
		this.updateSearch = this.updateSearch.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	updateSearch() {
		fetch('/match/getAllCompleteProfiles', {
			method: 'post',
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				age: this.state.age,
				popularity: this.state.popularity,
				distance: this.state.distanceMax,
				interests: this.state.interests,
				orderBy: this.state.orderBy
			})
		})
		.then(res => {
			if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then((data) => {
					if (this.props.onSubmit) {
						this.props.onSubmit(data.results)
					}
				});
			}
		})
	}

	componentDidMount() {
		this.updateSearch();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state !== prevState) {
			this.updateSearch();
		}
	}

	handleChange(name, value) {
		this.setState({
			[name]: value,
			errors: []
		});
	}

	render() {

		return (
			<div className="matchSearch inline">
						<SearchAge
							min={this.state.age.min}
							max={this.state.age.max}
							onChange={this.handleChange}
							/>
						<div className="lign"></div>
						<SearchPopularity
							min={this.state.popularity.min}
							max={this.state.popularity.max}
							onChange={this.handleChange}
							/>
						<div className="lign"></div>
						{
							this.props.locationIsPrivate ? null :
							<div>
								<SearchDistance
									max={this.state.distanceMax}
									onChange={this.handleChange}
									/>
								<div className="lign"></div>
							</div>
						}
						<SearchInterests
							value={this.state.interests}
							onChange={this.handleChange}
							onSubmit={true}
							submitOnEnter
							/>
						<div className="lign"></div>
						<SearchOrderBy
							value={this.state.orderBy}
							onChange={this.handleChange}
							locationIsPrivate={this.props.locationIsPrivate}
							/>
				</div>
			);
		}
	}

	export default MatchSearch;
