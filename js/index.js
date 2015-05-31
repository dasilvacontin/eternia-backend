'use strict'

var Player = require('./Player')

var io = require('socket.io')(8080)
var Map = require('./Map')
var map = new Map()

var WAIT_TIME = 500

io.on('connection', function (socket) {

  console.log('user connected', socket.id)

  var player = new Player(socket.id)
  map.addPlayer(player)

  socket.emit('whoami', player.getId())

  map.addUpdatesOfNearbyCells(player)
  io.emit('updates', map.getUpdates())
  map.cleanUpdates()

  var lastMovementDoneAt = +new Date

  socket.on('movePlayer', function (direction) {
    var now = +new Date
    if (now - lastMovementDoneAt >= WAIT_TIME) {
      lastMovementDoneAt = now
      map.playerMoveDirection(player, direction)
      map.addUpdatesOfNearbyCells(player)
      io.emit('updates', map.getUpdates())
      map.cleanUpdates()
    }
  })

  socket.on('attackPlayer', function (direction) {
    var now = +new Date
    if (now - lastMovementDoneAt >= WAIT_TIME) {
      lastMovementDoneAt = now
      map.playerAttacks(player, direction)
      map.addUpdatesOfNearbyCells(player)
      io.emit('updates', map.getUpdates())
      map.cleanUpdates()
    }
  })

  socket.on('disconnect', function () {
    console.log('user disconnected', socket.id)
  })
})

console.log('welcome to eternia')
