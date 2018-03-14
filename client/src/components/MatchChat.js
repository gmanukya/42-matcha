import React from 'react';

class MatchChat extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			message: "",
			messages: []
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		fetch('/chat/getMessages', {
			method: 'post',
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				contact: this.props.contact
			})
		})
		.then(res => {
			if (res.headers.get("content-type").indexOf("application/json") !== -1) {
				res.json().then((data) => {
					this.chat.scrollTop = this.chat.scrollHeight;
					this.chatTextArea.focus()
					this.setState({messages: data.messages});
				});
			}
		}).then(() => {
		this.props.socket.on('message', data => {
			this.addMessage(data.login, data.message);
		})
	});
	}

	componentDidUpdate() {
		this.chat.scrollTop = this.chat.scrollHeight;
	}

	componentWillUnmount() {
		this.props.socket.removeListener('message');
	}

	handleChange(event) {
		this.setState({message: event.target.value.substring(0, 10000)});
	}

	handleKeyDown(event) {
		if (event.which === 13 && this.state.message.trim()) {
			this.handleSubmit();
			event.preventDefault();
		}
	}

	handleSubmit() {
		this.addMessage(localStorage.getItem('login'), this.state.message);
		this.props.socket.emit('message', {
			toUser: this.props.contact,
			message: this.state.message
		}, this.setState({message: ""}));
	}

	addMessage(login, message) {
		var messages = this.state.messages;
		messages.push({login, message});
		this.setState({messages})
	}

	render() {
		return (
			<div className="matchProfileContainer">
				<div className="matchChat" ref={chat => this.chat = chat}>
					<div>
						{
							this.state.messages.map((message, index) =>
							<div key={index} className={message.login === this.props.contact ? null : "textAlignRight"}>
								<div className={message.login === this.props.contact ? "chatBubble you" : "chatBubble me"}>
									{message.message}
								</div>
							</div>
						)
					}
				</div>
			</div>
			<div className="arrow toProfil" onClick={() => this.props.changeToChat(false)}><i className="fas fa-angle-left"></i></div>
			<textarea
				className="chatTextArea"
				placeholder="Type your message..."
				ref={chatTextArea => this.chatTextArea = chatTextArea}
				value={this.state.message}
				onChange={this.handleChange}
				onKeyDown={this.handleKeyDown}
				onSubmit={this.handleSubmit}
				>
			</textarea>
		</div>
	);
}
}

export default MatchChat;
