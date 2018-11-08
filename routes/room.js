const assert = require('assert');

const Room = require('../models/room');
const Conn = require('../models/conn');

module.exports ={
    async createRoom(ctx) {
        const { rid } = ctx.data;
        assert(rid, 'Room rid cannot be empty');

        const room = await Room.findOne({ rid });
        assert(!room, 'Room exists');

        let newRoom = null;
        try {
            newRoom = await Room.create({
                rid,
                creator: ctx.socket.socket.conn,
                members: [ctx.socket.socket.conn],
            });
        } catch (err) {
            if (err.name === 'ValidationError') {
                return 'Invaid room rid';
            }
            throw err;
        }

        ctx.socket.socket.join(newRoom.rid);
        console.log(ctx.socket.socket.conn, ' create room ', newRoom.rid)
        return {
            rid: newRoom.rid,
            createTime: newRoom.createTime,
            creator: newRoom.creator,
        };
    },

    async joinRoom(ctx) {
        const { rid } = ctx.data;

        const room = await Room.findOne({ rid });
        assert(room, 'Room does not exists');
        assert(room.members.indexOf(ctx.socket.socket.conn) === -1, 'You have already joined the room');

        room.members.push(ctx.socket.socket.conn);
        await room.save();

        const messages = await Message
            .find(
                { toGroup: groupId },
                { type: 1, content: 1, from: 1, createTime: 1 },
                { sort: { createTime: -1 }, limit: 3 },
            )
            .populate('from', { uid: 1});
        messages.reverse();

        console.log(ctx.socket.socket.conn, 'join the room')
        ctx.socket.socket.join(rid);

        return {
            rid: room.rid,
            createTime: room.createTime,
            creator: room.creator,
            messages,
        };
    },

    async leaveRoom(ctx) {
        console.log('here')
        const { rid } = ctx.data;
        assert(!rid, 'Room rid cannot be empty');

        const room = await Room.findOne({ rid });
        assert(group, 'Room does not exist');

        const index = room.members.indexOf(ctx.socket.socket.conn);
        assert(index !== -1, 'You are not in the room');

        console.log(ctx.socket.socket.conn, 'left the room')

        room.members.splice(index, 1);

        if (room.members.length === 0) {
            await Room.remove({ rid })
        } else {
            await room.save();
        }

        ctx.socket.socket.leave(rid);

        return {};
    }

}