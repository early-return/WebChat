const crypto = require('crypto');
const config = require('./config');

module.exports = {
  genpass(password) {
    const md5 = crypto.createHash('md5');
    return md5.update(`--${password}--${config.salt}--`).digest('hex');
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
};
