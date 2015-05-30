'use strict'

var Cell = require('./Cell')
var util = require('./util')

function Map () {
  this.cells = {}
  this.players = {}
  this.updates = {
    cells: {},
    players: {}
  }
}

Map.prototype.getCellAt = function getCellAt (x, y) {
  var cellId = x + 'x' + y
  return this.getCellWithId(cellId)
}

Map.prototype.getCellWithId = function (cellId) {
  var cell = this.cells[cellId]
  if (cell) {
    return cell
  }

  cell = new Cell()
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
  var oldCell = this.getCellAt(player.getCellId())
  oldCell.setPlayerId(undefined)
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
  for (var x = currentPosition.x - 3; x <= currentPosition.x + 3; x++) {
    for (var y = currentPosition.y - 3; y <= currentPosition.x +3; y++) {
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

module.exports = Map
