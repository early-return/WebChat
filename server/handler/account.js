const ObjectID = require('mongodb').ObjectID;

const db = require('../db');
const util = require('../util');

const processLogin = async (user) => {
  const doc = await db.findUser({ email: user.email, password: user.password });
  if (doc.length < 1) {
    throw new Error('邮箱地址与密码不匹配！');
  }
  await db.removeToken({ uid: doc[0]._id });
  const token = util.gentoken();
  await db.addToken(token, doc[0]._id);
  return util.resp(true, '', { token, user: doc[0] });
};

const processLogout = async (uid, token) => {
  const res = await util.auth(token, uid);
  await db.removeToken({ _id: res._id });
  return util.resp(true, '', null);
};

const processRegister = async (user) => {
  const users = await db.findUser({ email: user.email });
  if (users.length > 0) {
    throw new Error('邮箱已被注册！');
  }
  user._id = new ObjectID();
  const doc = await db.updateUser(user);
  const token = util.gentoken();
  await db.addToken(token, user._id);
  return util.resp(true, '', { token, user: doc.value });
};

const processCheckEmail = async (email) => {
  const users = await db.findUser({ email });
  const status = { status: 'notexist' };
  if (users.length > 0) {
    status.status = 'exist';
  }
  return util.resp(true, '该邮箱已注册！', status);
};

const processUpdateUser = async (user, token) => {
  await util.auth(token, user._id);
  const users = await db.findUser({ email: user.email });
  if (users.length < 1) {
    throw new Error('系统出错');
  }
  user.email = '';
  user.password = '';
  const doc = await db.updateUser(user);
  return util.resp(true, '', doc.value);
};

const processGetProfile = async (uid) => {
  const users = await db.findUser({ _id: new ObjectID(uid) });
  if (users.length < 1) {
    throw new Error('未找到该用户！');
  }
  return util.resp(true, '', users[0]);
};

const processAuth = async (token) => {
  const doc = await util.auth(token);
  const users = await db.findUser({ _id: doc.uid });
  if (users.length < 1) {
    throw new Error('用户认证失败');
  }
  return util.resp(true, '', users[0]);
};

module.exports = {
  auth(req, res) {
    processAuth(req.params.token)
      .then(data => res.json(data))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },

  login(req, res) {
    const user = req.body;
    user.password = util.genpass(user.password);
    processLogin(user)
      .then(data => res.json(data))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },

  logout(req, res) {
    processLogout(req.body.uid, req.body.token)
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
    const user = req.body.data;

    processUpdateUser(user, req.body.token)
      .then(data => res.json(data))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },

  getProfile(req, res) {
    processGetProfile(req.params.uid)
      .then(data => res.json(data))
      .catch(err => res.json(util.resp(false, err.message, err.toString())));
  },
};
