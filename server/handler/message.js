const db = require('../db');
const util = require('../util');

const processGetAllMessages = async (token, uid) => {
  await util.auth(token, uid);
  const doc = await db.findAllMessages(uid);
  const res = {};
  doc.forEach((msg) => {
    if (!res[`${msg.session}`]) {
      res[`${msg.session}`] = [msg];
    } else {
      res[`${msg.session}`].push(msg);
    }
  });
  return util.resp(true, '', res);
};

module.exports = {
  getAllMessages(req, res) {
    processGetAllMessages(req.params.token, req.params.uid)
      .then(data => res.json(data))
      .catch(err => res.json(false, err.message, err.toString()));
  },
}
;
