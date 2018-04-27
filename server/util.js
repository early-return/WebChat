const crypto = require('crypto');
const config = require('./config');
const db = require('./db');

module.exports = {
  genpass(password) {
    const md5 = crypto.createHash('md5');
    return md5.update(`--${password}--${config.salt}--`).digest('hex');
  },
  gentoken() {
    const md5 = crypto.createHash('md5');
    return md5.update(`--${new Date().toString()}--${config.salt}--`).digest('hex');
  },
  resp(success, message, data) {
    return {
      success,
      message,
      data,
    };
  },
  randomAvatar() {
    return `/img/avatar/${Math.floor((Math.random() * 15) + 1)}.png`;
  },
  async auth(token, uid) {
    const doc = await db.findToken(token);
    if (doc === null || (uid && doc.uid.toString() !== uid)) {
      throw new Error('用户认证失败！');
    }
    return doc;
  },
};
