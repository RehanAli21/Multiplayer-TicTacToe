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

app.use(express.static('client/build'))

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

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

	socket.on('win', () => {
		let r = findRoom(socket)

		if (r !== '') {
			rooms[r].forEach(player => {
				io.to(player).emit('win')
			})
		}
	})

	socket.on('draw', () => {
		let r = findRoom(socket)

		if (r !== '') {
			rooms[r].forEach(player => {
				io.to(player).emit('draw')
			})
		}
	})

	socket.on('restart', () => {
		let r = findRoom(socket)

		if (r !== '') {
			rooms[r].forEach(player => {
				io.to(player).emit('restart')
			})
		}
	})

	socket.on('exit', () => {
		let r = findRoom(socket)

		if (r !== '') {
			if (rooms[r].length === 1) {
				delete rooms[r]
			} else if (rooms[r].length === 2) {
				const temp = rooms[r].filter(e => e !== socket.id)

				io.to(temp).emit('exit')

				rooms[r] = [temp]
			}
		}
	})

	socket.on('destroyRoom', ({ room }) => {
		if (rooms.hasOwnProperty(room)) delete rooms[room]
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
