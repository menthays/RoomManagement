const mongoose = require('mongoose');

const { Schema } = mongoose;

const RoomSchema = new Schema({
    createTime: { type: Date, default: Date.now },

    rid: {
        type: String,
        trim: true,
        unique: true,
        match: /^[0-9a-zA-Z]{1,8}$/,
        index: true,
    },
    
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Conn',
    },

    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Conn',
        },
    ],
});

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
