function noop() {}

/**
 * route middleware
 * @param {IO} io koa socket io instance
 * @param {Object} routes alias of events
 */
module.exports = function (io, _io, routes) {
    Object.keys(routes).forEach((route) => {
        io.on(route, noop);
    });

    return async (ctx) => {
        if (routes[ctx.event]) {
            const { event, data, socket } = ctx;
            ctx.res = await routes[ctx.event]({
                event,
                data,
                socket,
                io,
                _io,
            });
        }
    };
};
