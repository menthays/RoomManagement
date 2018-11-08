const mongoose = require('mongoose');

const { Schema } = mongoose;

const ConnSchema = new Schema({
    createTime: { type: Date, default: Date.now },

    uid: {
        type: String,
    },

    rid: {
        type: String,
    },

    ip: {
        type: String,
    },

    os: {
        type: String,
        default: '',
    },

    browser: {
        type: String,
        default: '',
    },

    environment: {
        type: String,
        default: '',
    },
});

const Conn = mongoose.model('Conn', ConnSchema);
module.exports = Conn;
