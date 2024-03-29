'use strict'

var UP = 0
var RIGHT = 1
var DOWN = 2
var LEFT = 3

var util = {}
util.getIncFromDirection = function (direction) {
  var inc = {x: 0, y: 0}
  switch (direction) {

    case UP:
      inc.y = -1
      break

    case DOWN:
      inc.y = 1
      break

    case LEFT:
      inc.x = -1
      break

    case RIGHT:
      inc.x = 1
      break

  }
  return inc
}

util.getPositionFromId = function (id) {
  if (!id)
    return
  var coords = id.split('x')
  var pos = {
    x: Number(coords[0]),
    y: Number(coords[1])
  }
  return pos
}

module.exports = util
