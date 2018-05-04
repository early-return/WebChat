const db = require('../db');
const util = require('../util');

const processGetFriends = async (token, uid) => {
  await util.auth(token, uid);
  const res = await db.findAllFriends(uid);
  return res;
};

const processGetUnknownFriends = async (token, uid) => {
  await util.auth(token, uid);
  const res = await db.findAllUnknownFriends(uid);
  return res;
};

const processAddFriendWithEmail = async (token, fromId, toEmail) => {
  await util.auth(token, fromId);
  const users = await db.findUser({ email: toEmail });
  if (users.length < 1) {
    throw new Error('未找到邮箱所对应的用户！');
  }
  const toId = users[0]._id;
  const af = await db.checkFriend(fromId, toId);
  if (af) {
    throw new Error('该用户已是您的好友！');
  }
  await db.addFriend(fromId, toId);
  const res = await db.findUser({ _id: toId });
  if (res.length < 1) {
    throw new Error('服务器错误！');
  }
  return res[0];
};

module.exports = {
  getFriends(req, res) {
    processGetFriends(req.params.token, req.params.uid)
      .then(data => res.json(util.resp(true, '', data)))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },

  getUnknownFriends(req, res) {
    processGetUnknownFriends(req.params.token, req.params.uid)
      .then(data => res.json(util.resp(true, '', data)))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },

  addFriend(req, res) {
    processAddFriendWithEmail(req.body.token, req.body.fromId, req.body.toEmail)
      .then(data => res.json(util.resp(true, '', data)))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },
};
