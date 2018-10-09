const io = require('socket.io-client');

const roomService = io('http://localhost:9200')

roomService.on('connect', () => {
    roomService.emit('createRoom', {name: 'testcyy'})
})

