import React, { useEffect, useState } from 'react'
import ResultDialog from './ResultDialog'

const matrix = [
	['', '', ''],
	['', '', ''],
	['', '', ''],
]

const Board = ({ setComp }) => {
	const [turn, setTurn] = useState('player1')
	const [cond, setCond] = useState('')
	const [restart, setRestart] = useState(false)

	useEffect(() => {
		if (restart) {
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					matrix[i][j] = ''
				}
			}

			for (let i = 1; i < 10; i++) {
				document.getElementById(`part${i}`).innerText = ''
			}

			setCond('')
			setRestart(false)
		}
	}, [restart])

	const select = e => {
		const ele = document.getElementById(e.target.id)

		if (ele && ele.innerText === '') {
			ele.innerText = turn === 'player1' ? 'X' : 'O'

			fillMatrix(e.target.id)

			if (checkWinner()) {
				setCond('win')
			} else {
				setTurn(turn === 'player1' ? 'player2' : 'player1')
			}

			console.log(matrix)
		}
	}

	const fillMatrix = s => {
		if (s === 'part1') matrix[0][0] = turn === 'player1' ? 'X' : 'O'
		else if (s === 'part2') matrix[0][1] = turn === 'player1' ? 'X' : 'O'
		else if (s === 'part3') matrix[0][2] = turn === 'player1' ? 'X' : 'O'
		else if (s === 'part4') matrix[1][0] = turn === 'player1' ? 'X' : 'O'
		else if (s === 'part5') matrix[1][1] = turn === 'player1' ? 'X' : 'O'
		else if (s === 'part6') matrix[1][2] = turn === 'player1' ? 'X' : 'O'
		else if (s === 'part7') matrix[2][0] = turn === 'player1' ? 'X' : 'O'
		else if (s === 'part8') matrix[2][1] = turn === 'player1' ? 'X' : 'O'
		else if (s === 'part9') matrix[2][2] = turn === 'player1' ? 'X' : 'O'
	}

	const checkWinner = () => {
		let s = turn === 'player1' ? 'X' : 'O'

		if (matrix[0][0] === s && matrix[0][1] === s && matrix[0][2] === s) {
			return true
		} else if (matrix[1][0] === s && matrix[1][1] === s && matrix[1][2] === s) {
			return true
		} else if (matrix[2][0] === s && matrix[2][1] === s && matrix[2][2] === s) {
			return true
		} else if (matrix[0][0] === s && matrix[1][0] === s && matrix[2][0] === s) {
			return true
		} else if (matrix[0][1] === s && matrix[1][1] === s && matrix[2][1] === s) {
			return true
		} else if (matrix[0][2] === s && matrix[1][2] === s && matrix[2][2] === s) {
			return true
		} else if (matrix[0][0] === s && matrix[1][1] === s && matrix[2][2] === s) {
			return true
		} else if (matrix[0][2] === s && matrix[1][1] === s && matrix[2][0] === s) {
			return true
		} else {
			return false
		}
	}
	return (
		<div>
			{cond === 'win' || cond === 'lose' || cond === 'draw' ? (
				<ResultDialog turn={turn} cond={cond} setComp={setComp} setRestart={setRestart} />
			) : null}
			<div className='boarddiv1'>
				<h2>{turn.toUpperCase()}'S TURN</h2>
				<button onClick={() => setComp('')}>Exit</button>
			</div>
			<div className='Board'>
				<div onClick={select} className='part' id='part1'></div>
				<div onClick={select} className='part' id='part2'></div>
				<div onClick={select} className='part' id='part3'></div>
				<div onClick={select} className='part' id='part4'></div>
				<div onClick={select} className='part' id='part5'></div>
				<div onClick={select} className='part' id='part6'></div>
				<div onClick={select} className='part' id='part7'></div>
				<div onClick={select} className='part' id='part8'></div>
				<div onClick={select} className='part' id='part9'></div>
			</div>
		</div>
	)
}

export default Board
