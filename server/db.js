const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const config = require('./config');

const COL_USERS = 'users';
const COL_TOKENS = 'tokens';
const COL_FRIENDS = 'friends';
const COL_MESSAGES = 'messages';
const COL_GROUPS = 'groups';
const COL_GROUP_USERS = 'group_users';
const COL_GROUP_MESSAGES = 'group_messages';
const COL_STATUS = 'status';

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
  async addFriend(fromUid, toUid) {
    const db = await getDB(COL_FRIENDS);

    const res = await db.col.insertOne({
      fromUid: new ObjectID(fromUid),
      toUid: new ObjectID(toUid),
    });
    db.client.close();
    return res;
  },

  async checkFriend(fromId, toId) {
    const db = await getDB(COL_FRIENDS);

    const res = await db.col.findOne({
      fromUid: new ObjectID(fromId),
      toUid: new ObjectID(toId),
    });

    return res;
  },

  async findAllFriends(uid) {
    let db = await getDB(COL_FRIENDS);

    const friends = await db.col.find({ fromUid: new ObjectID(uid) }).toArray();
    const ids = friends.map(friend => friend.toUid);
    db.client.close();

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

    const friends = await db.col.find({ toUid: new ObjectID(uid) }).toArray();
    const ids = friends.map(friend => friend.fromUid);
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
  async addMessage(msg) {
    msg.session = new ObjectID(msg.toId);

    let db = await getDB(`${COL_MESSAGES}_${msg.fromId}`);
    const res = await db.col.insertOne(msg);
    db.client.close();
    db = await getDB(`${COL_MESSAGES}_${msg.toId}`);
    msg.session = new ObjectID(msg.fromId);
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

  // 群组相关
  async addGroup(name, createdBy) {
    createdBy = new ObjectID(createdBy);
    const db = await getDB(COL_GROUPS);
    const res = await db.col.findOneAndUpdate(
      { _id: new ObjectID() },
      { $set: { name, createdBy } },
      {
        returnOriginal: false,
        upsert: true,
      },
    );
    db.client.close();
    return res;
  },

  async findGroup(condition) {
    const db = await getDB(COL_GROUPS);
    const res = db.col.findOne(condition);
    db.client.close();
    return res;
  },

  async addGroupsUser(gid, uid) {
    const db = await getDB(COL_GROUP_USERS);
    const res = await db.col.insertOne({
      gid: new ObjectID(gid),
      uid: new ObjectID(uid),
    });
    db.client.close();
    return res;
  },

  async findUserGroups(uid) {
    let db = await getDB(COL_GROUP_USERS);
    const res = await db.col.find({ uid: new ObjectID(uid) }).toArray();
    const ids = res.map(item => item.gid);
    db.client.close();
    db = await getDB(COL_GROUPS);
    const doc = db.col.find({ _id: { $in: ids } }).toArray();
    db.client.close();
    return doc;
  },

  async findGroupUsersId(gid) {
    const db = await getDB(COL_GROUP_USERS);
    const res = await db.col.find({ gid: new ObjectID(gid) }).toArray();
    const ids = res.map(item => item.uid);
    db.client.close();
    return ids;
  },


  // 群消息相关
  async addGroupMessage(msg) {
    msg.gid = new ObjectID(msg.gid);
    msg.fromId = new ObjectID(msg.fromId);
    const db = await getDB(COL_GROUP_MESSAGES);
    const res = await db.col.insertOne(msg);
    db.client.close();
    return res;
  },

  async findGroupMessages(condition) {
    const db = await getDB(COL_GROUP_MESSAGES);

    const res = await db.col.find(condition).sort({ date: -1 }).toArray();
    db.client.close();
    return res;
  },

  // 状态相关
  async addStatus(status) {
    const db = await getDB(COL_STATUS);
    const res = await db.col.findOneAndUpdate(
      { _id: new ObjectID() },
      { $set: status },
      {
        returnOriginal: false,
        upsert: true,
      },
    );
    db.client.close();
    return res;
  },

  async findStatus(uid, skip, limit) {
    const id = new ObjectID(uid);
    let db = await getDB(COL_FRIENDS);
    const friends = await db.col.find({ fromUid: id }).toArray();
    const ids = friends.map(friend => friend.toUid);
    ids.push(id);
    db.client.close();
    db = getDB(COL_STATUS);
    const res = db.col.find({ uid: { $in: ids } }).skip(skip).limit(limit).toArray();
    db.client.close();
    return res;
  },

};
