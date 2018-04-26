const mongo = require('mongodb');

const db = require('../db');
const util = require('../util');

const processLogin = async (user) => {
  const doc = await db.findUser({ email: user.email, password: user.password });
  if (doc.length < 1) {
    throw new Error('邮箱地址与密码不匹配！');
  }
  return util.resp(true, '', doc[0]);
};

const processRegister = async (user) => {
  const users = await db.findUser({ email: user.email });
  if (users.length > 0) {
    throw new Error('邮箱已被注册！');
  }
  user._id = new mongo.ObjectID();
  const doc = await db.updateUser(user);
  return util.resp(true, '', doc.value);
};

const processCheckEmail = async (email) => {
  const users = await db.findUser({ email });
  if (users.length < 1) {
    throw new Error('该邮箱地址还为注册！');
  }
  return util.resp(true, '该邮箱已注册！', null);
};

const processUpdateUser = async (user) => {
  const doc = await db.updateUser(user);
  return util.resp(true, '', doc);
};

module.exports = {
  login(req, res) {
    const user = req.body;
    user.password = util.genpass(user.password);
    processLogin(user)
      .then(data => res.json(data))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },

  register(req, res) {
    const user = req.body;
    user.password = util.genpass(user.password);
    user.avatar = util.randomAvatar();

    processRegister(user)
      .then(data => res.json(data))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },

  checkEmail(req, res) {
    processCheckEmail(req.params.email)
      .then(data => res.json(data))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },

  updateProfile(req, res) {
    const user = req.body;
    user.password = util.genpass(user.password);

    processUpdateUser(user)
      .then(data => res.json(data))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },
};
