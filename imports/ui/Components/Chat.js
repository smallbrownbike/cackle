import React from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import faker from 'faker';
import { Meteor } from 'meteor/meteor';
import randomcolor from 'randomcolor';

import { Chats } from '../../api/chats';

let username = null;
const roomName = decodeURI(window.location.pathname.slice(1)) || 'general',
	  colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
document.title = roomName;

class Modal extends React.Component{
	constructor(props){
		super(props)
		this.state = {username: username || `Stranger${faker.random.number({min: 1, max: 9999})}`, color: colors[Math.floor(Math.random() * colors.length)], error: false, errorMessage: '', changeBG: false}
	}
	handleChange = e => {
		let newState = {...this.state}
		if(e.target.type === 'checkbox'){
			newState['changeBG'] = !this.state.changeBG;
		} else {
			newState[e.target.getAttribute('name')] = e.target.value;
		}
		this.setState(newState)
	}
	userExists = (room, username) => {
		if(room){
			return room.users.filter(user => user.username === username).length > 0;
		}
	}
	handleKeyPress = e => {
		if(e.key === 'Enter'){
			this.handleClick();
		}
	}
	handleClick = () => {
		const newUsername = this.state.username.trim();
		let color = this.state.color.trim();
		if(colors.includes(color)){
			color = randomcolor.randomColor({hue: color, luminosity: 'light'})
		}
		if(!newUsername) return this.setState({error: true, errorMessage: 'This field cannot be blank'})
		const room = Chats.find({room: this.props.chats[0].room}).fetch()[0];
		if(!this.userExists(room, newUsername)){
			this.setState({error: false})
			const updatedUser = {
				username: newUsername,
				color: color || randomcolor.randomColor({luminosity: 'light'})
			}
			Meteor.call('chats.updateUser', this.props.chats[0]._id, updatedUser)
			username = newUsername;
			this.props.handleModal()
			if(this.state.changeBG){
				document.body.style.backgroundColor = color;
			}
		} else {
			this.setState({error: true, errorMessage: 'That username is taken'})
		}
	}
	render(){
		return (
			<div className='modal'>
				<div style={{width: '310px'}} className='container'>
					<div style={{width: '220px', margin: '0 auto'}}>
						<h2 style={{marginBottom: 0, marginTop: '2em', fontSize: '1em'}}>username</h2>
						<input onKeyPress={this.handleKeyPress} style={this.state.error ? {borderColor: '#ff0000'} : null} name='username' onChange={this.handleChange} value={this.state.username} className='newInfo' />
						{this.state.error && <h5 style={{marginTop: '.3em'}}>{this.state.errorMessage}</h5>}
						<h2 style={{marginBottom: 0, fontSize: '1em'}}>favorite color</h2>
						<input onKeyPress={this.handleKeyPress} name='color' onChange={this.handleChange} value={this.state.color} className='newInfo' />
						<h5 style={{marginTop: '.3em', display: 'inline'}}>Change background color</h5><input onChange={this.handleChange} style={{marginLeft: '.3em'}} type='checkbox' />
						<button onClick={this.handleClick} className='button'>join</button>
					</div>
				</div>
			</div>
		)
		
	}
}

class Online extends React.Component{
	render(){
		return(
			<div className='online'>
				<h1 style={{textAlign: 'center', paddingBottom: '.3em', wordWrap: 'break-word', borderBottom: '.5px solid #00000066', margin: '0 0 .3em 0'}}>{this.props.chats[0].room}</h1>
				{this.props.chats[0].users.map(user => {
					return(
						<div style={{border: `2px solid ${user.color}`}} className='user'>
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
		this.state = {value: '', modal: true}
	}
	handleChange = e => {
		this.setState({value: e.target.value})
	}
	handleKeyPress = e => {
		if(this.state.value && username && e.key === 'Enter'){
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
	handleModal = () => {
		this.setState({modal: !this.state.modal})
	}
	componentWillReceiveProps(props){
		if(props.chats.length <= 0){
			this.setState({demolished: true})
		}
	}
	render(){
		if(this.state.demolished){
			return(
				<div style={{textAlign: 'center', padding: '2em', boxShadow: '-1px 1px 25px #848484'}} className='container'>
					<h1>This room has been demolished!</h1>
					<h3>It was too quiet, so we blew up the joint.</h3>
					<a className='link' onClick={() => {location.reload()}}>refresh</a>
				</div>
			)
		}
		return (
			<div>
				<div style={{height: '90%', width: '800px', boxShadow: '-1px 1px 25px #848484'}} className='container'>
					{this.props.chats[0] && <Online chats={this.props.chats} />}
					<div style={{paddingLeft: '190px', height: '100%'}}>
					{this.props.chats[0] && <MessageBox chats={this.props.chats}/>}
					<input placeholder='Message' className='inputBox' value={this.state.value} onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
					</div>
				</div>
				{this.state.modal && <Modal handleModal={this.handleModal} chats={this.props.chats[0] && this.props.chats}/>}
			</div>
		)
	}
}

export default withTracker(() => {
	Meteor.subscribe('chats', roomName, username);
	const chats = Chats.find({room: roomName}).fetch(),
		  chatRoom = chats[0],
		  id = chatRoom && chatRoom._id,
		  roomColor = chatRoom && chatRoom.roomColor;
	if(roomColor){
		document.body.style.backgroundColor = roomColor;
	}
	return {
	  chats: chats
	};
})(Chat);