const Koa = require('koa');
const IO = require('koa-socket');
// const path = require('path');
const route = require('./middlewares/route');
const catchError = require('./middlewares/catchError');
const enhanceContext = require('./middlewares/enhanceContext.js');

const roomRoutes = require('./routes/room');
const Conn = require('./models/conn');

const app = new Koa();

const io = new IO({
    ioOptions: {
        pingTimeout: 10000,
        pingInterval: 5000,
    },
});

io.attach(app);

io.use(enhanceContext());
io.use(catchError())
io.use(route(
    app.io,
    app._io,
    Object.assign({}, roomRoutes),
));

app.io.on('connection', async (ctx) => {
    console.log(`  <<<< connection ${ctx.socket.id} ${ctx.socket.request.connection.remoteAddress}`);
    let conn = await Conn.create({
        id: ctx.socket.id,
        ip: ctx.socket.request.connection.remoteAddress,
    });
    ctx.socket.conn = conn._id
});

app.io.on('disconnect', async (ctx) => {
    console.log(`  >>>> disconnect ${ctx.socket.id}`);
    await Conn.remove({
        id: ctx.socket.id,
    });
    ctx.socket.conn = null
});


module.exports = app;
