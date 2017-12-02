import React from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import faker from 'faker';

import { Chats } from '../../api/chats'

const roomName = window.location.pathname.slice(1),
			username = faker.internet.userName();

class ViewBox extends React.Component{
	componentDidUpdate(){
		if(this.lastMessage){
			ReactDOM.findDOMNode(this.lastMessage).scrollIntoView()
		}
	}

	render(){
		return(
			<div className='viewBox'>
				{this.props.chats.map(chat => {
					return (
						<div ref={ref => this.lastMessage = ref} className='message'>
							<div className='username'>{chat.username}</div>
							<div className='date'>{new Date(chat.date).toLocaleString()}</div>							
							<div className='text'>{chat.text}</div>
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
			Chats.insert({
				room: roomName,
				username: username,
				text: this.state.value,
				date: Date.now()
			})
			this.setState({value: ''})
		}
	}
	render(){
		return (
			<div className='container'>
				<div className='online'></div>
				<div className='chatBox'>
					<ViewBox chats={this.props.chats}/>
					<div>
						<input placeholder='Message' className='chatInput' value={this.state.value} onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
					</div>
				</div>
			</div>
		)
	}
}

export default withTracker(() => {
	return {
	  chats: Chats.find({room: roomName}, {sort: {date: 1}}).fetch(),
	};
})(Chat);