import React from 'react'
import Chat from './Components/Chat'
import './App.css'

export default class App extends React.Component{
	render(){
		return (
			<div>
				
				<div style={{position: 'absolute', top: 0, left: 0, marginLeft: '2em'}}>
					<h1 style={{marginBottom: '0em'}}>CACKLE</h1>
					<h5 style={{marginTop: '0em'}}>dynamic chatroom generator</h5>
				</div>
				<Chat />
			</div>
		)
	}
}