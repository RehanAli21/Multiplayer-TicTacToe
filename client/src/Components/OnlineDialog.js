import React from 'react'

const OnlineDialog = ({ setComp, roomRef }) => {
	const setJoiningKey = () => {
		const ele = document.getElementById('roomKeyInput')

		if (ele && ele.value !== '') {
			roomRef.current = ele.value

			setComp('onlineBoard')

			ele.value = ''
		}
	}

	return (
		<div className='result'>
			<h1 style={{ backgroundColor: 'black' }}>ONLINE</h1>
			<button
				style={{ float: 'right', backgroundColor: 'red', marginTop: '-200px', marginRight: '20px' }}
				onClick={() => setComp('')}>
				Exit
			</button>
			<button onClick={() => setComp('onlineBoard')}>Start Game</button>
			<div style={{ backgroundColor: 'black' }}>
				<input type='text' placeholder='joining key' id='roomKeyInput' />
				<button onClick={setJoiningKey}>Join</button>
			</div>
		</div>
	)
}

export default OnlineDialog
