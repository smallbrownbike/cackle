import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'
import randomcolor from 'randomcolor';
import faker from 'faker';

export const Chats = new Mongo.Collection('chats');

let timeout;

function resetTimeout(id){
	if(timeout){
		clearTimeout(timeout)
	}
	timeout = setTimeout(() => {
		const message = {
			username: 'Botman',
			message: "This room will be demolished soon. Send a message to keep 'er alive.",
			date: Date.now()
		};
		Chats.update({_id: id}, {$push: {messages: message}})
	}, 480000)
}
function createNewUser(id, username, color){
	const newUser = {
		username: username,
		color: color
	}
	Chats.update({_id: id}, {$push: {users: newUser}, $set: {lastUpdate: new Date()}})
	resetTimeout(id)
}
function queryDB(query){
	return Chats.find(query).fetch()
}
if (Meteor.isServer) {
	Chats.allow({
		update: () => {
			return true;
		}
	});
	Meteor.publish('chats', function chatsPublication(roomName, username) {
		const chats = queryDB({room: roomName});
		if(chats.length === 0){
			const initialData = {
				room: roomName,
				roomColor: null,
				users: [],
				lastUpdate: new Date(),
				messages: [
					{
						username: 'Botman',
						message: `Welcome to ${roomName}! Say something interesting.`,
						date: Date.now(),
					}
				]
					
			}
			Chats.insert(initialData)
		}
		this.onStop(() => {
			const chatRoom = queryDB({room: roomName})[0];
			if(chatRoom){
				const id = chatRoom._id;
				Chats.update({_id: id}, {$pull: {users: {username: username}}})
			}
		})
		return Chats.find({room: roomName});
	});
}

Meteor.methods({
	'chats.newMessage'(id, message) {
		Chats.update({_id: id}, {$push: {messages: message}, $set: {lastUpdate: new Date()}})
		resetTimeout(id)
	},
	'chats.updateUser'(id, userInfo) {
		createNewUser(id, userInfo.username, userInfo.color)
	}
});
