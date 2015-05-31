'use strict'

var util = require('./util')

function Cell (cellId) {
  this.id = cellId
  this.playerId = undefined
  this.resource = undefined

  var structure = Math.floor(Math.random() * 100)
  switch (structure) {
    case 0:
      var qtyInitializer = Math.floor(Math.random() * 20 + 10)
      this.setResource({
        type: 'wood',
        qty: qtyInitializer,
        maxQty: qtyInitializer
      })
      break
  }
}

Cell.prototype.isAvailable = function () {
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
