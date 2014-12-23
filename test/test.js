var lock = require('../index')
  , domQuickText = require('dom-quick-text')
  , requestFullscreen = require('fullscreen')
  , pointer
  , fullscreen

var label = new domQuickText('pointer lock test. Press any key to lock');


var cursorDiv = document.createElement('div')

document.body.appendChild(cursorDiv)

cursorDiv.style.display = 'none'
cursorDiv.style.position = 'absolute'
cursorDiv.style.width =
cursorDiv.style.height = '20px'
cursorDiv.style.top = 
cursorDiv.style.left = '0px'
cursorDiv.style.backgroundColor = 'red'


fullscreen = requestFullscreen(document.body) 
pointer = lock(document.body)

document.body.onkeydown = function(ev) {
  if(!pointer.target()) pointer.request()
  else pointer.release()
}

pointer.on('error', console.log.bind(console))
pointer.on('needs-fullscreen', function() {
  fullscreen.once('attain', function() {
    pointer.request()
  })
  fullscreen.request()
})


pointer.on('attain', function(stream) {
  var current = {x: stream.initial.x, y: stream.initial.y}
  cursorDiv.style.display = 'block'
  label.update('attained pointer lock');
  stream
    .on('data', function(move) {
      current.x += move.dx
      current.y += move.dy
      label.update(current.x+'px '+ current.y+'px');
      cursorDiv.style.left = current.x+'px'
      cursorDiv.style.top = current.y+'px'
    })
})

pointer.on('release', function() {
  cursorDiv.style.display = 'none'
  label.update('released pointer lock')
})