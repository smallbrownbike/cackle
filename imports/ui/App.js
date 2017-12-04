import React from 'react'
import Chat from './Components/Chat'
import './App.css'

export default class App extends React.Component{
	render(){
		return (
			<div>
				
				<div style={{position: 'absolute', top: 0, left: 0, marginLeft: '2em'}}>
					<h1 style={{fontSize: '2.2em', color: '#383838', borderBottom: '.5px solid #00000066', display: 'inline-block'}}>cackle</h1>
				</div>
				<Chat />
			</div>
		)
	}
}