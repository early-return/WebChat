const crypto = require('crypto');
const config = require('./config');
const db = require('./db');

module.exports = {
  // 通过MD5加密的方式加密密码
  genpass(password) {
    const md5 = crypto.createHash('md5');
    return md5.update(`--${password}--${config.salt}--`).digest('hex');
  },
  // 生成一个新的令牌
  gentoken() {
    const md5 = crypto.createHash('md5');
    return md5.update(`--${new Date().toString()}--${config.salt}--`).digest('hex');
  },
  // 通过参数构造http响应对象
  resp(success, message, data) {
    return {
      success,
      message,
      data,
    };
  },
  // 随机生成一个头像
  randomAvatar() {
    return `/static/img/avatar/${Math.floor((Math.random() * 15) + 1)}.png`;
  },
  // 传入令牌和用户ID进行认证
  async auth(token, uid) {
    const doc = await db.findToken(token);
    if (doc === null || (uid && doc.uid.toString() !== uid)) {
      throw new Error('用户认证失败！');
    }
    return doc;
  },
};
