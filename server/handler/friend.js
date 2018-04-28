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

module.exports = {
  getFriends(req, res) {
    processGetFriends(req.params.token, req.params.uid)
      .then(data => res.json(data))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },

  addFriend(req, res) {
    processAddFriend(req.body.token, req.body.fromId, req.body.toId)
      .then(data => res.json(data))
      .catch(err => res.json(false, err.message, err.toString()));
  },
};
