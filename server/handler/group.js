const db = require('../db');
const util = require('../util');

const processCreateGroup = async (token, uid, gname) => {
  await util.auth(token, uid);
  const group = await db.findGroup({ name: gname });
  if (group) {
    throw new Error('已存在同名群组！');
  }
  const res = await db.addGroup(gname, uid);
  await db.addGroupsUser(res.value._id, uid);
  return res.value;
};

const processAddGroup = async (token, uid, gname) => {
  await util.auth(token, uid);
  const res = await db.findGroup({ name: gname });
  if (!res) {
    throw new Error('未找到该群组！');
  }
  const doc = await db.addGroupsUser(res._id, uid);
  return doc;
};

const processGetGroupMessages = async (token, uid) => {
  await util.auth(token, uid);
  const res = await db.findUserGroups(uid);
  const ids = res.map(item => item._id);
  const doc = await db.findGroupMessages({ gid: { $in: ids } });
  const data = {};
  doc.forEach((message) => {
    if (data[message.gid]) {
      data[message.gid].push(message);
    } else {
      data[message.gid] = [message];
    }
  });
  return data;
};

module.exports = {
  createGroup(req, res) {
    processCreateGroup(req.body.token, req.body.uid, req.body.gname)
      .then(data => res.json(util.resp(true, '', data)))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },
  addGroup(req, res) {
    processAddGroup(req.body.token, req.body.uid, req.body.gname)
      .then(data => res.json(util.resp(true, '', data)))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },
  getGroupMessages(req, res) {
    processGetGroupMessages(req.params.token, req.params.uid)
      .then(data => res.json(util.resp(true, '', data)))
      .catch(err => res.josn(util.ress(false, err.message, err.toString())));
  },
};
