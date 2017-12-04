import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'
import randomcolor from 'randomcolor';
import faker from 'faker';

export const Chats = new Mongo.Collection('chats');
function createNewUser(id, username, color){
	const newUser = {
		username: username,
		color: color
	}
	Chats.update({_id: id}, {$push: {users: newUser}})
}
function queryDB(query){
	return Chats.find(query).fetch()
}
if (Meteor.isServer) {
	Meteor.publish('chats', function chatsPublication(roomName, username) {
		const chats = queryDB({room: roomName});
		if(chats.length === 0){
			const initialData = {
				room: roomName,
				roomColor: null,
				users: [],
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
			const id = queryDB({room: roomName})[0]._id;
			Chats.update({_id: id}, {$pull: {users: {username: username}}})
		})
		return Chats.find({room: roomName});
	});
}

Meteor.methods({
	'chats.newMessage'(id, message) {
		Chats.update({_id: id}, {$push: {messages: message}})
	},
	'chats.updateUser'(id, userInfo) {
		createNewUser(id, userInfo.username, userInfo.color)
	}
});