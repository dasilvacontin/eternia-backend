'use strict'

var Player = require('./Player')

var io = require('socket.io')(8080)
var Map = require('./Map')
var map = new Map()

io.on('connection', function (socket) {

  console.log('user connected')

  var player = new Player(socket.id)
  map.addPlayer(player)

  socket.on('movePlayer', function (direction) {
    map.playerMoveDirection(player, direction)
    io.emit('updates', map.getUpdates())
    map.cleanUpdates()
  })

  socket.on('attackPlayer', function () {

  })

  socket.on('disconnect', function () {

  })
})

console.log('welcome to eternia')