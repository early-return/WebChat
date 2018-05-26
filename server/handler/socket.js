const ObjectID = require('mongodb').ObjectID;

const util = require('../util');
const db = require('../db');

const socketMap = new Map();
const idMap = new Map();

// 发送好友消息
const sendMessage = async (data) => {
  // 获取消息数据
  const msg = data.message;
  // 为新消息生成ID
  msg._id = new ObjectID();
  // 为新消息添加发送时间
  msg.date = new Date();
  // 验证用户身份
  await util.auth(data.token, msg.fromId);
  // 将消息数据加入数据库
  await db.addMessage(msg);
  // 判断来源用户是否在线
  if (socketMap.has(msg.fromId)) {
    // 获取来源用户Socket
    const socket = socketMap.get(msg.fromId);
    msg.session = msg.toId;
    // 向来源用户发送消息
    socket.emit('message', msg);
  }
  // 判断目标用户是否在线
  if (socketMap.has(msg.toId)) {
    // 获取目标用户是否在线
    const socket = socketMap.get(msg.toId);
    msg.session = msg.fromId;
    // 向目标用户发送消息
    socket.emit('message', msg);
  }
};

const sendGroupMessage = async (data) => {
  const msg = data.message;
  msg._id = new ObjectID();
  msg.date = new Date();
  await util.auth(data.token, msg.fromId);
  await db.addGroupMessage(msg);
  const ids = await db.findGroupUsersId(msg.toId);
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
