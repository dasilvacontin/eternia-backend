'use strict'

var util = require('./util')

var MAX_QTY = 200

function Player (playerId, username) {
  this.id = playerId
  this.username = username
  this.hp = this.maxHP = 100
  this.cellId = undefined
  this.resources = {}
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

Player.prototype.incResource = function(type, qty) {
	var current = this.resources[type] || 0
	this.resources[type] = Math.min(MAX_QTY, current + qty)
}

module.exports = Player
