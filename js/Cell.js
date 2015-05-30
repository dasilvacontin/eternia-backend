'use strict'

function Cell (cellId) {
  this.id = cellId
  this.playerId = undefined
}

Cell.prototype.isAvailable = function () {
  return !this.playerId
}

Cell.prototype.getId = function () {
  return this.id
}

Cell.prototype.setPlayerId = function (playerId) {
  this.playerId = playerId
}

Cell.prototype.getPlayerId = function () {
  return this.playerId
}

module.exports = Cell
