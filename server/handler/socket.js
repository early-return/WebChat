const ObjectID = require('mongodb').ObjectID;

const util = require('../util');
const db = require('../db');

const socketMap = new Map();
const idMap = new Map();

const sendMessage = async (data) => {
  const msg = data.message;
  msg._id = new ObjectID();
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

module.exports = {
  handle(socket) {
    socket.on('auth', (data) => {
      util.auth(data.token, data.uid)
        .then(() => {
          socketMap.set(data.uid, socket);
          idMap.set(socket, data.uid);
          socket.on('message', (msg) => {
            sendMessage(msg)
              .catch((err) => {
                socket.emit('info', { success: false, message: err.message });
              });
          });
          socket.emit('info', { success: true, message: '已连接到服务器！' });
        }).catch((err) => {
          socket.emit('info', { success: false, message: err.message });
        });
    });

    socket.on('disconect', () => {
      socketMap.delete(idMap.get(socket));
      idMap.delete(socket);
    });
  },
};
