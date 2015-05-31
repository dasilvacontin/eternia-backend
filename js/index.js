'use strict'

var Player = require('./Player')
var UniqueId = require('unique-id')

var io = require('socket.io')(8080)
var Map = require('./Map')
var map = new Map()

var hashTokenPerUser = {}

var WAIT_TIME = 500

io.on('connection', function (socket) {

  console.log('user connected', socket.id)
  var player
  var playerId
  var playerToken

  socket.on('hello', function(username, token) {
    if (token && hashTokenPerUser[token]) {
      playerId = hashTokenPerUser[token]
      player = map.getPlayer(playerId)
      playerToken = token
    } else {
      username = username || 'n00b'
      player = new Player(socket.id, username)
      playerId = socket.id
      map.addPlayer(player)
      playerToken = new UniqueId()
    }
    socket.emit('whoami', player.getId(), playerToken)
  })

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

  socket.on('build', function (building) {

  })

  socket.on('disconnect', function () {
    console.log('user disconnected', socket.id)
    player.asleepSince = new Date

  })
})

console.log('welcome to eternia')
