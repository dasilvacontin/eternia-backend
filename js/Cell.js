'use strict'

var util = require('./util')

function Cell (cellId) {
  this.id = cellId
  this.playerId = undefined
  this.resource = undefined

  var structure = Math.floor(Math.random() * 20)
  switch (structure) {
    case 0:
      var qtyInitializer = Math.floor(Math.random() * 20 + 10)
      this.setResource({
        type: 'wood',
        qty: qtyInitializer,
        maxQty: qtyInitializer
      })
      break
    case 1:
      var qtyInitializer = Math.floor(Math.random() * 5 + 5)
      this.setResource({
        type: 'stone',
        qty: qtyInitializer,
        maxQty: qtyInitializer
      })
      break
  }
}

Cell.prototype.isAvailable = function (player) {
  if (player && this.resource && this.resource.playerId === player.id)
    return true
  return !this.playerId && !this.resource
}

Cell.prototype.getPositionObject = function () {
  return util.getPositionFromId(this.id)
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

Cell.prototype.setResource = function(resource) {
	this.resource = resource
}

Cell.prototype.getResource = function() {
	return this.resource
}

module.exports = Cell
