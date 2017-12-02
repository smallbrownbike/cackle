import React from 'react'

export default class Chat extends React.Component{
	render(){
		return (
			<div className='container'>
				<div className='viewBox'>
					<div className='message'>Hello world!</div>
				</div>
				<input className='chatInput' />
			</div>
		)
	}
}