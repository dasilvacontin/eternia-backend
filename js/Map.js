'use strict'

var Cell = require('./Cell')
var util = require('./util')

var DISTANCE = 10

function Map () {
  this.cells = {}
  this.players = {}
  this.updates = {
    cells: {},
    players: {}
  }
}

Map.prototype.getCellAt = function getCellAt (x, y) {
  if (x == null || y == null) throw new Error('Map#getCellAt incorrect arguments')
  var cellId = x + 'x' + y
  return this.getCellWithId(cellId)
}

Map.prototype.getCellWithId = function (cellId) {
  if (cellId == null) throw new Error('Map#getCellWithId with null cellId=')
  var cell = this.cells[cellId]
  if (cell) {
    return cell
  }

  cell = new Cell(cellId)
  //Random creation of something
  var structure = Math.floor((Math.random() * 100), 0)
  switch (structure) {
    case 0:
      cell.setResource({type: 'wood', qty: Math.floor((Math.random() * 30, 10))})
      break
    case 1:
      cell.setResource({type: 'berries', qty: Math.floor((Math.random() * 5, 1))})
      break
  }
  this.cells[cellId] = cell
  return cell
}

Map.prototype.addPlayer = function (player) {
  var x = 0
  var cell = this.getCellAt(x, 0)
  while (!cell.isAvailable()) {
    cell = this.getCellAt(++x, 0)
  }

  this.setPlayerCell(player, cell)
  this.players[player.getId()] = player

  return cell
}

Map.prototype.setPlayerCell = function (player, cell) {
  var oldCellId = player.getCellId()
  if (oldCellId) {
    var oldCell = this.getCellWithId(oldCellId)
    oldCell.setPlayerId(null)
  }
  player.setCellId(cell.getId())
  cell.setPlayerId(player.getId())
}

Map.prototype.getPlayer = function (playerId) {
  return this.players[playerId]
}

Map.prototype.playerMoveDirection = function (player, direction) {
  var inc = util.getIncFromDirection(direction)
  var cell = this.getCellWithId(player.getCellId())
  var pos = cell.getPositionObject()
  var targetCell = this.getCellAt(pos.x + inc.x, pos.y + inc.y)
  if (!targetCell.isAvailable()) {
    return
  }
  this.setPlayerCell(player, targetCell)
  console.log(cell)

  this.updates.cells[cell.getId()] = cell
  this.updates.cells[targetCell.getId()] = targetCell
  this.updates.players[player.getId()] = player
}

Map.prototype.getUpdates = function () {
  return this.updates
}

Map.prototype.cleanUpdates = function () {
  this.updates.cells = {}
  this.updates.players = {}
  return
}

Map.prototype.addUpdatesOfNearbyCells = function(player) {
  var currentPosition = player.getPositionObject()
  for (var x = currentPosition.x - DISTANCE; x <= currentPosition.x + DISTANCE; x++) {
    for (var y = currentPosition.y - DISTANCE; y <= currentPosition.x + DISTANCE; y++) {
      var cell = this.getCellAt(x, y)
      this.updates.cells[cell.getId()] = cell
      var playerId = cell.getPlayerId()
      if (playerId) {
        var player = this.getPlayer(playerId)
        this.updates.players[playerId] = player
      }
    }
  }
}

Map.prototype.playerAttacks = function(player, direction) {
  var inc = util.getIncFromDirection(direction)
  var cell = this.getCellWithId(player.getCellId())
  var pos = cell.getPositionObject()
  var targetCell = this.getCellAt(pos.x + inc.x, pos.y + inc.y)
  if (targetCell.isAvailable()) {
    return
  }

  var totalDamage = player.getHit()
  var targetPlayer = this.getPlayer(targetCell.getPlayerId())
  targetPlayer.takeDamage(totalDamage)
  /*
  console.log('Attack from player ' + player.getId() + ' to player ' + targetPlayer.getId()
    + ' with ' + totalDamage + 'points of damage. Hp of player ' + targetPlayer.getId()
    + ' is ' + targetPlayer.getHp())
  */

  if (!targetPlayer.isAlive()) {
    targetCell.setPlayerId(null)
    targetPlayer.setCellId(null)
  }
}

module.exports = Map
