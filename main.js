const mongoose = require('mongoose');

const app = require('./app');
const config = require('./config');

mongoose.Promise = Promise;

mongoose.connect(config.database,  {dbName: 'test'},  async (err) => {
    if (err) {
        console.error('connect database error!');
        console.error(err);
        return process.exit(1);
    }

    app.listen(config.port, async () => {
        console.log(` >>> server listen on http://localhost:${config.port}`);
    });
});
