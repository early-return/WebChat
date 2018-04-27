const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const config = require('./config');

const COL_USERS = 'users';
const COL_TOKENS = 'tokens';
const COL_FRIENDS = 'friends';
const COL_MESSAGES = 'messages';

const getDB = async (colName) => {
  const client = await mongo.connect(config.mongoAddress);
  const db = client.db(config.mongoDbName);
  const col = db.collection(colName);

  return { client, col };
};

module.exports = {

  // 用户相关操作
  async addUser(user) {
    const db = await getDB(COL_USERS);

    const res = db.col.insertOne(user);
    db.client.close();
    return res;
  },

  async updateUser(user) {
    const db = await getDB(COL_USERS);

    const set = {};
    if (user.email) set.email = user.email;
    if (user.name) set.name = user.name;
    if (user.avatar) set.avatar = user.avatar;
    if (user.password) set.password = user.password;

    const res = db.col.findOneAndUpdate(
      { _id: new ObjectID(user._id) },
      { $set: set },
      {
        returnOriginal: false,
        upsert: true,
      },
    );
    db.client.close();
    return res;
  },

  async findUser(condition) {
    const db = await getDB(COL_USERS);

    const res = await db.col.find(
      condition,
      { password: 0 },
    ).toArray();
    db.client.close();
    return res;
  },

  // Token 相关
  async addToken(token, uid) {
    const db = await getDB(COL_TOKENS);

    const res = await db.col.insertOne({ token, uid });
    db.client.close();
    return res;
  },

  async findToken(token) {
    const db = await getDB(COL_TOKENS);

    const res = await db.col.findOne({ token });
    db.client.close();
    return res;
  },

  async removeToken(condition) {
    const db = await getDB(COL_TOKENS);

    const res = await db.col.remove(condition);
    db.client.close();
    return res;
  },

  // 好友相关
  async addFriends(fromUid, toUid) {
    const db = await getDB(COL_FRIENDS);

    const res = await db.col.insertOne({
      fromUid: new ObjectID(fromUid),
      to: new ObjectID(toUid),
    });
    db.client.close();
    return res;
  },

  async findAllFriends(uid) {
    let db = await getDB(COL_FRIENDS);

    const ids = await db.col.find({ fromUid: new ObjectID(uid) })
      .toArray()
      .map(friend => friend.toUid);

    db = await getDB(COL_USERS);
    const res = await db.col.find(
      { _id: { $in: ids } },
      { password: 0 },
    ).toArray();
    db.client.close();
    return res;
  },

  async findAllUnknownFriends(uid) {
    let db = await getDB(COL_FRIENDS);

    const ids = await db.col.find({ toUid: new ObjectID(uid) })
      .toArray()
      .map(friend => friend.toUid);
    db.client.close();

    db = await getDB(COL_USERS);
    const res = await db.col.find(
      { _id: { $in: ids } },
      { password: 0 },
    ).toArray();
    db.client.close();
    return res;
  },

  async removeFriend(fromUid, toUid) {
    const db = await getDB(COL_FRIENDS);

    const res = await db.col.remove({
      fromUid: new ObjectID(fromUid),
      toUid: new ObjectID(toUid),
    });
    db.client.close();
    return res;
  },

  // 消息相关
  async addMessage(fromId, toId, message) {
    const msg = {
      session: new ObjectID(toId),
      fromId: new ObjectID(fromId),
      toId: new ObjectID(toId),
      message,
      date: new Date(),
    };

    let db = await getDB(`${COL_MESSAGES}_${fromId}`);
    const res = await db.col.insertOne(msg);
    db.client.close();
    db = await getDB(`${COL_MESSAGES}_${toId}`);
    msg.session = new ObjectID(fromId);
    await db.col.insertOne(msg);
    db.client.close();
    return res;
  },

  async findAllMessages(uid) {
    const db = await getDB(`${COL_MESSAGES}_${uid}`);

    const res = await db.col.find().sort({ date: -1 }).toArray();
    db.client.close();
    return res;
  },

};
