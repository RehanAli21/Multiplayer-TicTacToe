import React, { useState } from 'react'
import Board from './Board'

const Main = () => {
	const [comp, setComp] = useState('')

	const showComp = () => {
		if (comp === 'onlineBoard') {
		} else if (comp === 'localBoard') {
			return <Board setComp={setComp} />
		} else {
			return (
				<div className='Main'>
					<h1>WELCOME</h1>
					<button onClick={() => setComp('localBoard')}>Local Game</button>
					<button>Online Game</button>
				</div>
			)
		}
	}

	return showComp()
}

export default Main
