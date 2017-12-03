import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import randomcolor from 'randomcolor';

export const Chats = new Mongo.Collection('chats');

if (Meteor.isServer) {
	Meteor.publish('chats', function chatsPublication(roomName, username) {
		const chats = Chats.find({room: roomName}).fetch();
		if(chats.length === 0){
				const initialData = {
					room: roomName,
					roomColor: randomcolor.randomColor({luminosity: 'light'}),
					users: [username],
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
				Chats.update({id: chats[0]._id}, {$push: {users: username}})
			}
		return Chats.find({room: roomName});
	});
}

Meteor.methods({
	'chats.newMessage'(id, message) {
		Chats.update({_id: id}, {$push: {messages: message}})
	}
});