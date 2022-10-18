import React, { useState, useRef } from 'react'
import Board from './Board'
import OnlineBoard from './OnlineBoard'
import OnlineDialog from './OnlineDialog'

const Main = () => {
	const [comp, setComp] = useState('')
	const roomRef = useRef('')

	const showComp = () => {
		if (comp === 'onlineBoard') {
			return <OnlineBoard setComp={setComp} roomRef={roomRef} />
		} else if (comp === 'localBoard') {
			return <Board setComp={setComp} />
		} else {
			return (
				<React.Fragment>
					<div className='Main'>
						<h1>WELCOME</h1>
						<button onClick={() => setComp('localBoard')}>Local Game</button>
						<button onClick={() => setComp('online')}>Online Game</button>
					</div>
					{comp === 'online' ? <OnlineDialog setComp={setComp} roomRef={roomRef} /> : null}
				</React.Fragment>
			)
		}
	}

	return showComp()
}

export default Main
