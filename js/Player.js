'use strict'

function Player (playerId, cellId) {
  this.id = playerId
  this.hp = this.maxHP = 100
  this.cell = cellId
}

Player.prototype.isAlive = function () {
  return this.hp > 0
}

Player.prototype.takeDamage = function (damage) {
  this.hp = Math.max(0, this.hp - damage)
}

module.exports = Player
