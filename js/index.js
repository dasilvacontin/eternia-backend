'use strict'

var Player = require('./Player')

var io = require('socket.io')()
var map = require('Map')()

io.on('connection', function (socket) {

  var player = new Player(socket.id)
  map.addPlayer(player)

  socket.on('movePlayer', function (direction) {
    map.playerMoveDirection(player, direction)
    io.emit('updates', map.getUpdates())
    map.cleanUpdates()
  })

  socket.on('disconnect', function () {

  })
})
