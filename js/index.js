'use strict'

var Player = require('./Player')
var uniqueId = require('unique-id')

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
      player.asleepSince = null
    } else if (username) {
      username = username || 'n00b'
      player = new Player(socket.id, username)
      playerId = socket.id
      map.addPlayer(player)
      playerToken = uniqueId()
      hashTokenPerUser[playerToken] = playerId
    }
    if (player) {
      console.log('player linked to eternia', player.username)
      socket.emit('whoami', player && player.getId(), playerToken)
      map.addUpdatesOfNearbyCells(player)
      io.emit('updates', map.getUpdates())
      map.cleanUpdates()
      listenToPlayerActions(socket, player)
    } else {
      socket.emit('failedLogin')
    }
  })

})

function listenToPlayerActions (socket, player) {
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

  socket.on('build', function (building, direction) {
    map.playerBuilds(player, direction, building)
    map.addUpdatesOfNearbyCells(player)
    io.emit('updates', map.getUpdates())
    map.cleanUpdates()
  })

  socket.on('disconnect', function () {
    console.log('user disconnected', socket.id)
    player.asleepSince = new Date
    map.addUpdatesOfNearbyCells(player)
    io.emit('updates', map.getUpdates())
    map.cleanUpdates()
  })
}

console.log('welcome to eternia')

function healPlayers () {
  console.log('heal')
  var players = map.players
  for (var playerId in players) {
    var player = players[playerId]
    var cell
    if (player.cellId) {
      cell = map.getCellWithId(player.cellId)
    }
    if (cell && cell.resource && cell.resource.type === 'house') {
      player.hp = Math.min(player.maxHP, player.hp + 1)
    }
  }
}
setInterval(healPlayers, 5000)
