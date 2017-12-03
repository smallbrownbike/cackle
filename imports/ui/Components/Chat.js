import React from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import faker from 'faker';
import { Meteor } from 'meteor/meteor';

import { Chats } from '../../api/chats'

const roomName = window.location.pathname.slice(1),
			username = `Stranger${faker.random.number({min: 1, max: 9999})}`;

class MessageBox extends React.Component{
	scrollBottom = () => {
		if(this.lastMessage){
			ReactDOM.findDOMNode(this.lastMessage).scrollIntoView()
		}
	}
	componentDidUpdate(){
		this.scrollBottom()
	}
	componentDidMount(){
		this.scrollBottom()
	}

	render(){
		return(
			<div className='messageBox'>
				{this.props.chats[0].messages.map((chat, index) => {
					return (
						<div key={index} ref={ref => this.lastMessage = ref} className='message'>
							<div className='username'>{chat.username}</div>
							<div className='date'>{new Date(chat.date).toLocaleString()}</div>							
							<div className='text'>{chat.message}</div>
						</div>
					)
				})}
			</div>
		)
	}
	
}

class Chat extends React.Component{
	constructor(props){
		super(props)
		this.state = {value: ''}
	}
	handleChange = e => {
		this.setState({value: e.target.value})
	}
	handleKeyPress = e => {
		if(e.key === 'Enter'){
			const id = this.props.chats[0]._id,
						message = {
							username: username,
							message: this.state.value,
							date: Date.now()
						};
			Meteor.call('chats.newMessage', id, message)
			this.setState({value: ''})
		}
	}
	render(){
		return (
			<div className='container'>
				<div className='online'></div>
				{this.props.chats[0] && <MessageBox chats={this.props.chats}/>}
				<input placeholder='Message' className='inputBox' value={this.state.value} onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
			</div>
		)
	}
}

export default withTracker(() => {
	Meteor.subscribe('chats', roomName, username);
	const chats = Chats.find({room: roomName}).fetch(),
				chatRoom = chats[0],
				id = chatRoom && chatRoom._id
				roomColor = chatRoom && chatRoom.roomColor;		

	if(roomColor){
		document.body.style.backgroundColor = roomColor;
	}
	return {
	  chats: chats,
	};
})(Chat);