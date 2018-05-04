const ObjectID = require('mongodb').ObjectID;

const util = require('../util');
const db = require('../db');

const socketMap = new Map();
const idMap = new Map();

const sendMessage = async (data) => {
  const msg = data.message;
  msg._id = new ObjectID();
  msg.date = new Date();
  await util.auth(data.token, msg.fromId);
  await db.addMessage(msg);
  if (socketMap.has(msg.fromId)) {
    const socket = socketMap.get(msg.fromId);
    msg.session = msg.toId;
    socket.emit('message', msg);
  }
  if (socketMap.has(msg.toId)) {
    const socket = socketMap.get(msg.toId);
    msg.session = msg.fromId;
    socket.emit('message', msg);
  }
};

const sendGroupMessage = async (data) => {
  const msg = data.message;
  msg._id = new ObjectID();
  msg.date = new Date();
  await util.auth(data.token, msg.fromId);
  await db.addGroupMessage(msg);
  const ids = await db.findGroupUsersId(msg.gid);
  ids.forEach((id) => {
    if (socketMap.has(id.toString())) {
      const socket = socketMap.get(id.toString());
      socket.emit('group message', msg);
    }
  });
};

process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', error);
  process.exit(1); // To exit with a 'failure' code
});

module.exports = {
  handle(socket) {
    socket.on('auth', (data) => {
      util.auth(data.token, data.uid)
        .then(() => {
          socketMap.set(data.uid, socket);
          idMap.set(socket, data.uid);
          socket.emit('success', { success: true, message: '已连接到服务器！' });
        }).catch((err) => {
          socket.emit('error', { success: false, message: err.message });
        });
    });

    socket.on('message', (msg) => {
      sendMessage(msg)
        .catch((err) => {
          console.log(err.message, err);
        });
    });

    socket.on('group message', (msg) => {
      sendGroupMessage(msg)
        .catch((err) => {
          console.log(err.message, err);
        });
    });

    socket.on('disconect', () => {
      socketMap.delete(idMap.get(socket));
      idMap.delete(socket);
    });
  },
};
