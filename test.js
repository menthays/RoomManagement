const io = require('socket.io-client');

const roomService = io('http://localhost:9200')

function fetch(event, data = {}, {
    toast = true,
} = {}) {
    return new Promise((resolve) => {
        roomService.emit(event, data, (res) => {
            if (typeof res === 'string') {
                if (toast) {
                    console.error(res);
                }
                resolve([res, null]);
            } else {
                resolve([null, res]);
            }
        });
    });
}


roomService.on('connect', async () => {
    let a = await fetch('createRoom', ({rid: 'kkyy'}))
})

