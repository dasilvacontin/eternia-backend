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
  if (!targetCell.isAvailable(player)) {
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

  var resource = targetCell.getResource()
  if (resource) {
    console.log('Resource', resource)
    player.incResource(resource.type, 1)
    resource.qty--
    if (resource.qty > 0)
      targetCell.setResource(resource)
    else targetCell.setResource(null)
  } else {

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
      var loot = targetPlayer.resources
      for (var type in loot) {
        player.incResource(type, loot[type] * (Math.random() * 0.2 + 0.8))
      }
    }
  }
}

Map.prototype.playerBuilds = function(player, direction, building) {
  var inc = util.getIncFromDirection(direction)
  var cell = this.getCellWithId(player.getCellId())
  var pos = cell.getPositionObject()
  var targetCell = this.getCellAt(pos.x + inc.x, pos.y + inc.y)
  if (!targetCell.isAvailable()) {
    return
  }

  var resource
  var cost
  switch (building) {
    case 0:
      resource = {
        type: 'house',
        qty: 500,
        maxQty: 500,
        playerId: player.getId()
      }
      cost = {
        type: 'stone',
        qty: 40
      }
      break
    case 1:
      resource = {
        type: 'fence',
        qty: 300,
        maxQty: 300
      }
      cost = {
        type: 'wood',
        qty: 20
      }
      break
  }
  if (player.resources[cost.type] >= cost.qty) {
    targetCell.setResource(resource)
    player.incResource(cost.type, -cost.qty)
  }
}

module.exports = Map
