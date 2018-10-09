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
            _id: newRoom._id,
            name: newRoom.name,
            createTime: newRoom.createTime,
            creator: newRoom.creator,
        };
    },

    async joinRoom(ctx) {
        // const { rid } = ctx.data;

        // const room = await Room.findOne({ _id: groupId });
        // assert(group, '加入群组失败, 群组不存在');
        // assert(group.members.indexOf(ctx.socket.user) === -1, '你已经在群组中');

        // group.members.push(ctx.socket.user);
        // await group.save();

        // const messages = await Message
        //     .find(
        //         { toGroup: groupId },
        //         { type: 1, content: 1, from: 1, createTime: 1 },
        //         { sort: { createTime: -1 }, limit: 3 },
        //     )
        //     .populate('from', { username: 1, avatar: 1 });
        // messages.reverse();

        // ctx.socket.socket.join(group._id);

        // return {
        //     _id: group._id,
        //     name: group.name,
        //     avatar: group.avatar,
        //     createTime: group.createTime,
        //     creator: group.creator,
        //     messages,
        // };
        return 1;
    },
}