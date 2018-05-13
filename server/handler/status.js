const ObjectID = require('mongodb').ObjectID;

const db = require('../db');
const util = require('../util');

const processGetStatus = async (skip, limit, uid, token) => {
  await util.auth(token, uid);
  const res = await db.findStatus(uid, Number(skip), Number(limit));
  return res;
};

const processPublishStatus = async (uid, token, status) => {
  await util.auth(token, uid);
  status.uid = new ObjectID(status.uid);
  status.date = new Date();
  const res = db.addStatus(status);
  return res;
};

module.exports = {
  publishStatus(req, res) {
    processPublishStatus(req.body.uid, req.body.token, req.body.data)
      .then(data => res.json(util.resp(true, '', data)))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },
  getStatus(req, res) {
    processGetStatus(req.params.skip, req.params.limit, req.params.uid, req.params.token)
      .then(data => res.json(util.resp(true, '', data)))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },
};
