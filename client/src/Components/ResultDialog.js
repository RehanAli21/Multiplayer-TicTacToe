import React from 'react'

const ResultDialog = ({ turn, cond, setComp, exit, setRestart }) => {
	return (
		<div className='result'>
			<h1>{cond === 'win' ? `${turn} is Winner` : 'Game is Draw'}</h1>
			<button style={{ marginRight: '20px' }} onClick={() => setRestart(true)}>
				Restart
			</button>
			<button
				style={{ marginLeft: '20px', background: 'red' }}
				onClick={() => {
					if (exit !== '') exit()
					setComp('')
				}}>
				Exit
			</button>
		</div>
	)
}

export default ResultDialog
