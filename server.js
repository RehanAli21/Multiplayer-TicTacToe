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

const findRoom = socket => {
	let r = ''
	for (const room in rooms) {
		rooms[room].forEach(e => {
			if (e === socket.id) {
				r = room
			}
		})
	}

	return r
}
// on socket connection
io.on('connection', socket => {
	socket.on('start', ({ room }) => {
		rooms[room] = [socket.id]
	})

	socket.on('join', ({ room }) => {
		if (rooms.hasOwnProperty(room) && rooms[room].length < 2) {
			io.to(rooms[room][0]).emit('otherPlayerOnline')

			io.to(socket.id).emit('otherPlayerOnline')

			rooms[room].push(socket.id)
		}
	})

	socket.on('move', ({ id }) => {
		let r = findRoom(socket)

		rooms[r].forEach(player => {
			io.to(player).emit('move', { id })
		})
	})

	socket.on('disconnect', () => {
		let r = findRoom(socket)

		if (r !== '') {
			if (rooms[r].length === 1) {
				delete rooms[r]
			} else if (rooms[r].length === 2) {
				const temp = rooms[r].filter(e => e !== socket.id)

				io.to(temp).emit('otherPlayerOffline')

				rooms[r] = [temp]
			}
		}
	})
})

////////////////////////////////////////
// Server listening
////////////////////////////////////////
const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log('Yes it is running'))
