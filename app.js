const Koa = require('koa');
const IO = require('koa-socket');
// const path = require('path');
const route = require('./middlewares/route');
const roomRoutes = require('./routes/room');
const Socket = require('./models/socket');

const app = new Koa();

const io = new IO({
    ioOptions: {
        pingTimeout: 10000,
        pingInterval: 5000,
    },
});

io.attach(app);

io.use(route(
    app.io,
    app._io,
    Object.assign({}, roomRoutes),
));

app.io.on('connection', async (ctx) => {
    console.log(`  <<<< connection ${ctx.socket.id} ${ctx.socket.request.connection.remoteAddress}`);
    await Socket.create({
        id: ctx.socket.id,
        ip: ctx.socket.request.connection.remoteAddress,
    });
});
app.io.on('disconnect', async (ctx) => {
    console.log(`  >>>> disconnect ${ctx.socket.id}`);
    await Socket.remove({
        id: ctx.socket.id,
    });
});

module.exports = app;
