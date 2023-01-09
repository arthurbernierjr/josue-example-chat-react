const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const path = require('path')

const app = express()
const httpserver = http.Server(app)
const io = socketio(httpserver)

const gamedirectory = path.join(__dirname, 'build')

app.use(express.static(gamedirectory))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(path.join(__dirname, 'build', 'index.html')))
})
httpserver.listen(3000)

const rooms = []
const usernames = []

io.on('connection', function (socket) {
  socket.on('join', function (room, username) {
    if (username != '') {
      rooms[socket.id] = room
      usernames[socket.id] = username
      socket.leaveAll()
      socket.join(room)
      io.in(room).emit('recieve', 'Server : ' + username + ' has entered the chat.')
      socket.emit('join', room)
    }
  })

  socket.on('send', function (message, room, username) {
    io.in(room).emit('recieve', username + ' : ' + message)
    console.log('send: ', message)
    console.log(usernames)
    console.log(rooms)
  })

  socket.on('recieve', function (message) {
    socket.emit('recieve', message)
    console.log('recieve: ', message)
  })
})
