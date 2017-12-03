import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import randomcolor from 'randomcolor';

export const Chats = new Mongo.Collection('chats');

if (Meteor.isServer) {
	Meteor.publish('chats', function chatsPublication(roomName) {
		const chats = Chats.find({room: roomName}).fetch();
		if(chats.length === 0){
				const initialMessage = {
					room: roomName,
					roomColor: randomcolor.randomColor({luminosity: 'light'}),
					messages: [
						{
							username: 'Botman',
							message: `Welcome to ${roomName}! Say something interesting.`,
							date: Date.now(),
						}
					]
						
				}
				Chats.insert(initialMessage)
			}
		return Chats.find({room: roomName});
	});
}

Meteor.methods({
    'chats.update'(id, message) {
        Chats.update({_id: id}, {$push: {messages: message}})
    }
});