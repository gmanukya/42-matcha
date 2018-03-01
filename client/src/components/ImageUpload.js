import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

class ImageUpload extends Component {

	constructor(props) {
		super(props);

		this.state = {
			acceptedFiles: [],
			pictures: [],
			profilePic: "",
			hideDropzone: undefined
		};

		this.onDrop = this.onDrop.bind(this);
		this.deletePicture = this.deletePicture.bind(this);
		this.setProfilePic = this.setProfilePic.bind(this);
		this.updatePictures = this.updatePictures.bind(this);
		this.hideDropzone = this.hideDropzone.bind(this);
	}

	setProfilePic(e) {
		e.preventDefault();
		const target = e.target;
		const url = target.src.replace(/^http:\/\/localhost:3000\//, '');
		fetch('/update/setProfilePic', {
			credentials: 'include',
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({url: url})
		})
		.then(() => this.setState({profilePic: url}, this.updatePictures()));

	}


	deletePicture(e) {
		e.preventDefault();
		const target = e.target.id ? e.target : e.target.parentNode;
		const buttonId = target.id;
		const nextId = target.parentNode.nextSibling.firstChild.id;
		const previous = target.parentNode.previousSibling;

		fetch('/update/deletePic', {
			credentials: 'include',
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				url: buttonId,
				isProfilePic: this.state.profilePic === buttonId
			})
		})
		.then(() => {
			if (this.state.profilePic === buttonId) {

				if(nextId || previous.firstChild) {
					const nextProfilePic = previous.firstChild ? previous.firstChild.id : nextId;
					fetch('/update/setProfilePic', {
						credentials: 'include',
						method: 'post',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({url: nextProfilePic})
					})
					.then(() => this.setState({profilePic: nextProfilePic},
						  () => this.updatePictures()))

				} else {
					this.setState({profilePic: ""}, () => this.updatePictures());
				}

			} else {
				this.updatePictures();
			}
		})
	}


	updatePictures() {
		fetch('/update/getUploaded', {
			credentials: 'include',
			method: 'get'
		}).then(res => {
			if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then(data => {
					var pictures = [];

					if (data.profilePic) {
						this.setState({profilePic: data.profilePic});
					}

					for(var i in data.urls){
						pictures.push(
							<div key={i} className="inline fifth spaceLeft">
								<button
									className="floatLeft"
									id={data.urls[i]}
									onClick={this.deletePicture}
									>
									<i className="fas fa-trash-alt"></i>
								</button>
								<div
									className="picContainer marginAuto"
									id={this.state.profilePic === data.urls[i] ? "profilePicContainer" : ""}
									>
									<img
										className="pic"
										src={data.urls[i]}
										alt={data.urls[i]}
										onClick={this.setProfilePic}
										/>
								</div>
							</div>
						);
					}

					var picCount = data.urls.length;
					this.setState({pictures, picCount}, () => {
						this.hideDropzone();

						if (this.state.firstPic) {
							this.myImg.click();
						}

					});
				});
			}
		}).then(() => {
			if (this.props.onChange) {
				this.props.onChange('profile_pic', this.state.profilePic);
			}
		});
	}

	componentDidMount() {
		this.updatePictures();
	}

	hideDropzone() {
		if (this.state.picCount >= 5) {
			this.setState({hideDropzone: {}});
		} else {
			this.setState({hideDropzone: undefined});
		}
	}

	onDrop(accepted, rejected) {
		var acceptedFiles = this.state.acceptedFiles;

		if(this.state.picCount < 5) {
			acceptedFiles.push(accepted);

			this.setState({acceptedFiles});

			var formData = new FormData();
			formData.append('photo', accepted[0]);
			formData.append('picCount', this.state.picCount);
			fetch('/update/upload', {
				credentials: 'include',
				method: 'post',
				body: formData
			}).then(() => this.updatePictures());

		} else{
			alert("You have reached the limit of files");
		}
	}


	render() {
		return (
			<div>
				<b>Your pictures</b>
				<br/>
				{this.state.pictures}
				<div className="inline fifth spaceLeft">
					<Dropzone
						style={this.state.hideDropzone}
						onDrop={this.onDrop}
						multiple={false}
						accept="image/jpeg, image/png"
						>
					</Dropzone>
				</div>
			</div>
		);
	}
}

export default ImageUpload;
