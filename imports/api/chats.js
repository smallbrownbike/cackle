import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import randomcolor from 'randomcolor';
import faker from 'faker';

export const Chats = new Mongo.Collection('chats');

if (Meteor.isServer) {
	Meteor.publish('chats', function chatsPublication(roomName, username) {
		function queryDB(query){
			return Chats.find(query).fetch()
		}

		const chats = queryDB({room: roomName});

		if(chats.length === 0){
			const initialData = {
				room: roomName,
				roomColor: randomcolor.randomColor({luminosity: 'light'}),
				users: [
					{
						username: username,
						created: Date.now(),
						color: randomcolor.randomColor({luminosity: 'dark'})
					}
				],
				messages: [
					{
						username: 'Botman',
						message: `Welcome to ${roomName}! Say something interesting.`,
						date: Date.now(),
					}
				]
					
			}
			Chats.insert(initialData)
		} else {
			const newUser = {
				username: username,
				created: Date.now(),
				color: randomcolor.randomColor({luminosity: 'dark'})
			}
			Chats.update({_id: chats[0]._id}, {$push: {users: newUser}})
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
	}
});