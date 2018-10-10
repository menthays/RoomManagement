const assert = require('assert');

const Room = require('../models/room');
const Socket = require('../models/socket');

module.exports ={
    async createRoom(ctx) {
        const { name } = ctx.data;
        assert(name, 'Room name cannot be empty');

        const room = await Room.findOne({ name });
        assert(!room, 'Room exists');

        let newRoom = null;
        try {
            newRoom = await Room.create({
                name,
                creator: ctx.socket._id,
                members: [ctx.socket._id],
            });
        } catch (err) {
            if (err.name === 'ValidationError') {
                return 'Invaid room name';
            }
            throw err;
        }

        ctx.socket.socket.join(newRoom.name);
        return {
            name: newRoom.name,
            createTime: newRoom.createTime,
            creator: newRoom.creator,
        };
    },

    async joinRoom(ctx) {
        const { name } = ctx.data;

        const room = await Room.findOne({ name });
        assert(room, 'Room does not exists');
        assert(room.members.indexOf(ctx.socket._id) === -1, 'You have already joined the room');

        room.members.push(ctx.socket._id);
        await room.save();

        const messages = await Message
            .find(
                { toGroup: groupId },
                { type: 1, content: 1, from: 1, createTime: 1 },
                { sort: { createTime: -1 }, limit: 3 },
            )
            .populate('from', { uid: 1});
        messages.reverse();

        ctx.socket.socket.join(name);

        return {
            name: room.name,
            createTime: room.createTime,
            creator: room.creator,
            messages,
        };
    },
}