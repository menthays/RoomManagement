const { env } = process;

module.exports = {
    // service port
    port: env.Port || 9200,
    // mongodb address
    database: env.Database || 'mongodb://127.0.0.1:27017/',
};
