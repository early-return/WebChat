const mongo = require('mongodb').MongoClient;
const config = require('./config');

const url = config.mongoAddress;
const dbName = config.mongoDbName;

module.exports = {

  // 用户相关操作
  async addUser(user) {
    console.log('in addUser');
    const client = await mongo.connect(url);
    const db = client.db(dbName);
    const col = db.collection('users');

    const res = col.insertOne(user);
    client.close();
    return res;
  },

  async updateUser(user) {
    const client = await mongo.connect(url);
    const db = client.db(dbName);
    const col = db.collection('users');

    const res = col.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          password: user.password,
        },
      },
      {
        returnOriginal: false,
        upsert: true,
      },
    );

    return res;
  },

  async findUser(condition) {
    const client = await mongo.connect(url);
    const db = client.db(dbName);
    const col = db.collection('users');

    const res = await col.find(
      condition,
      { password: 0 },
    ).toArray();
    console.log('findUser: ', res);
    client.close();
    return res;
  },

};
