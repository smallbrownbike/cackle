import React from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import faker from 'faker';
import { Meteor } from 'meteor/meteor';
import randomcolor from 'randomcolor';

import { Chats } from '../../api/chats';

const username = `Stranger${faker.random.number({min: 1, max: 9999})}`;

class Online extends React.Component{
	render(){
		return(
			<div className='online'>
				<h1 style={{textAlign: 'center', paddingBottom: '.3em', wordWrap: 'break-word', borderBottom: '.5px solid #00000066', margin: '0 0 .3em 0'}}>{this.props.chats[0].room}</h1>
				{this.props.chats[0].users.map(user => {
					return(
						<div style={{border: user.username === username ? '2px solid #383838' : 'none', backgroundColor: user.color}} className='user'>
							{user.username}
						</div>
					)
				})}
			</div>
		)
	}
}

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
					const getColor = username => {
						const user = this.props.chats[0].users.filter(user => user.username === username)[0];
						return user ? user.color : null;
					}
					return (
						<div key={index} ref={ref => this.lastMessage = ref} className='message'>
							<div style={{color: getColor(chat.username)}} className='username'>{chat.username}</div>
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
		if(this.state.value && e.key === 'Enter'){
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
			<div>
				<div className='container'>
					{this.props.chats[0] && <Online chats={this.props.chats} />}
					{this.props.chats[0] && <MessageBox chats={this.props.chats}/>}
					<input placeholder='Message' className='inputBox' value={this.state.value} onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
				</div>
			</div>
		)
	}
}

export default withTracker(() => {
	const roomName = roomName = decodeURI(window.location.pathname.slice(1)) || 'general'
	document.title = roomName;
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