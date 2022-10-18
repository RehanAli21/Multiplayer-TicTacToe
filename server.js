const express = require('express')
const http = require('http')
const cors = require('cors')
const socketio = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
})

// middlewares
app.use(express.json())
app.use(cors())

const rooms = {}
// on socket connection
io.on('connection', socket => {
	socket.on('start', ({ room }) => {
		rooms[room] = [socket.id]

		console.log(`after start rooms = ${rooms}`)
	})

	socket.on('join', ({ room }) => {
		if (rooms.hasOwnProperty(room)) {
			rooms[room].push(socket.id)
		}

		console.log(`after join rooms = ${rooms}`)
	})

	socket.on('disconnect', () => {
		let r = ''

		for (const room in rooms) {
			rooms[room].forEach(e => {
				if (e === socket.id) {
					r = room
				}
			})
		}

		if (r !== '') {
			if (rooms[r].length === 1) {
				delete rooms[r]
			} else if (rooms[r].length === 2) {
				const temp = rooms[r].filter(e => e === socket.id)

				rooms[r] = temp
			}
		}
	})
})

////////////////////////////////////////
// Server listening
////////////////////////////////////////
const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log('Yes it is running'))
