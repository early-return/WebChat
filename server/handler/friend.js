const db = require('../db');
const util = require('../util');

const processGetFriends = async (token, uid) => {
  await util.auth(token, uid);
  const res = await db.findAllFriends(uid);
  return util.resp(true, '', res);
};

const processAddFriend = async (token, fromId, toId) => {
  await util.auth(token, fromId);
  await db.addFriend(fromId, toId);
  return util.resp(true, '', null);
};

const processAddFriendWithEmail = async (token, fromId, toEmail) => {
  const users = await db.findUser({ email: toEmail });
  if (users.length < 1) {
    throw new Error('未找到邮箱所对应的用户！');
  }
  const res = await processAddFriend(token, fromId, users[0]._id);
  return res;
};

module.exports = {
  getFriends(req, res) {
    processGetFriends(req.params.token, req.params.uid)
      .then(data => res.json(data))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },

  addFriend(req, res) {
    if (req.body.toEmail) {
      processAddFriendWithEmail(req.body.token, req.body.fromId, req.body.toEmail)
        .then(data => res.json(data))
        .catch(err => res.json(util.resp(false, err.message, err.toString())));
    }
    processAddFriend(req.body.token, req.body.fromId, req.body.toId)
      .then(data => res.json(data))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },
};
