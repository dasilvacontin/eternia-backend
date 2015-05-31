'use strict'

var util = require('./util')

function Player (playerId, cellId) {
  this.id = playerId
  this.hp = this.maxHP = 100
  this.cellId = cellId
}

Player.prototype.isAlive = function () {
  return this.hp > 0
}

Player.prototype.takeDamage = function (damage) {
  this.hp = Math.max(0, this.hp - damage)
}

Player.prototype.getPositionObject = function () {
  return util.getPositionFromId(this.cellId)
}

Player.prototype.getId = function () {
  return this.id
}

Player.prototype.setCellId = function (cellId) {
  this.cellId = cellId
}

Player.prototype.getCellId = function () {
  return this.cellId
}

Player.prototype.getHit = function() {
	return Math.floor((Math.random() * 10) + 1)
}

Player.prototype.getHp = function() {
	return this.hp
}

module.exports = Player
