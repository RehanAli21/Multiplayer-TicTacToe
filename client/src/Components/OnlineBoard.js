import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'
import ResultDialog from './ResultDialog'

const matrix = [
	['', '', ''],
	['', '', ''],
	['', '', ''],
]

let socket = io('http://localhost:5000')
const room = uuidv4()

const OnlineBoard = ({ setComp, roomRef }) => {
	const [turn, setTurn] = useState(roomRef.current === '' ? 'player1' : 'player2')
	const [cond, setCond] = useState('')
	const [restart, setRestart] = useState(false)
	const [connected, setConnected] = useState(false)

	useEffect(() => {
		socket.on('otherPlayerOnline', () => setConnected(true))

		socket.on('otherPlayerOffline', () => setConnected(false))

		if (roomRef.current === '') {
			socket.emit('start', { room: room })
		} else {
			socket.emit('join', { room: roomRef.current })
		}

		return () => {
			roomRef.current = ''
			socket.disconnect()
		}
	}, [])

	useEffect(() => {
		if (restart) {
			resetComp()
		}

		return resetComp()
	}, [restart])

	const resetComp = () => {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				matrix[i][j] = ''
			}
		}

		for (let i = 1; i < 10; i++) {
			const ele = document.getElementById(`part${i}`)

			if (ele) ele.innerText = ''
		}

		setCond('')
		setRestart(false)
		setTurn('player1')
	}

	const select = e => {
		socket.emit('move', { id: e.target.id })

		const ele = document.getElementById(e.target.id)

		if (ele && ele.innerText === '') {
			ele.innerText = turn === 'player1' ? 'X' : 'O'

			fillMatrix(e.target.id)

			if (checkWinner()) {
				setCond('win')
			} else if (draw()) {
				setCond('draw')
			} else {
				setTurn(turn === 'player1' ? 'player2' : 'player1')
			}
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

	const draw = () => {
		let draw = true

		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix[i].length; j++) {
				if (matrix[i][j] === '') {
					draw = false
				}
			}
		}

		return draw
	}

	const toggleKey = () => {
		const ele = document.getElementById('keytext')

		if (ele) {
			ele.style.display = ele.style.display === 'inline-block' ? 'none' : 'inline-block'
		}
	}

	return (
		<div style={{ textAlign: 'center' }}>
			{cond === 'win' || cond === 'lose' || cond === 'draw' ? (
				<ResultDialog turn={turn} cond={cond} setComp={setComp} setRestart={setRestart} />
			) : null}
			<div className='boarddiv1'>
				<h2>{turn.toUpperCase()}'S TURN</h2>
				<button onClick={() => setComp('')}>Exit</button>
			</div>
			{connected ? (
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
			) : (
				<h1>Not Connected to the user</h1>
			)}

			<div style={{ position: 'absolute', top: '20px', left: '40px', color: 'white' }}>
				<button className='keybutton' onClick={toggleKey}>
					KEY
				</button>
				<p style={{ display: 'none' }} id='keytext'>
					{roomRef.current === '' ? room : roomRef.current}
				</p>
			</div>
		</div>
	)
}

export default OnlineBoard