const Mock = require('mockjs');

const Random = Mock.Random;

// 构造虚拟数据

let index = 0;

// 构造虚拟消息的方法
function generateMessage(from, to) {
  index += 1;
  return {
    id: index,
    fromId: from.id,
    from: from.name,
    fromAvatar: from.avatar,
    toId: to.id,
    to: to.name,
    toAvatar: to.avatar,
    message: Random.csentence(5, 50),
    date: new Date(Random.datetime()),
  };
}

// 用于存放构造的虚拟数据
const data = {
  self: {
    id: 1,
    name: Random.cname(),
    bgImage: Random.dataImage('250x100', '背景'),
    avatar: Random.dataImage('50x50', '自己'),
    infoList: [
      { title: '好友', content: '20', link: '#' },
      { title: '动态', content: '10', link: '#' },
      { title: '测试', content: 'haha', link: '#' },
    ],
  },
  users: [],
  allMessages: {},
  statusList: [],
  logged: true,
};


// 构造用户数据
for (let i = 0; i < 10; i += 1) {
  const name = Random.cname();
  const user = {
    id: i + 2,
    name,
    avatar: Random.dataImage('50x50', name),
  };
  data.users.push(user);
}

// 构造消息数据
for (let i = 0; i < data.users.length; i += 1) {
  const messages = [];
  for (let j = 0; j < 10; j += 1) {
    const message = generateMessage(data.users[i], data.self);
    messages.push(message);
  }
  for (let j = 0; j < 10; j += 1) {
    const message = generateMessage(data.self, data.users[i]);
    messages.push(message);
  }

  messages.sort((msg1, msg2) => new Date(msg1.date) - new Date(msg2.date));
  data.allMessages[`${data.users[i].id}`] = messages;
}

// 构造用户动态
for (let i = 0; i < data.users.length; i += 1) {
  const status = {
    uid: data.users[i].id,
    uname: data.users[i].name,
    content: Random.csentence(5, 50),
    date: Random.datetime(),
    like: Random.integer(),
  };

  data.statusList.push(status);
}
data.statusList.sort((status1, status2) => new Date(status1.date) - new Date(status2.date));

Mock.mock('/api/messages/all', 'get', () => ({
  success: true,
  message: '',
  data: data.allMessages,
}));
Mock.mock(/\/api\/messages\/(\d*)/, 'get', () => ({
  success: true,
  message: '',
  data: data.allMessages[0].messages,
}));
Mock.mock('/api/auth', 'get', () => ({
  success: true,
  message: '',
  data: (data.logged ? data.self : null) }));
Mock.mock(/\/api\/check_user\/(.+)/, 'get', () => ({
  success: true,
  message: '',
  data: 'exist',
}));
Mock.mock('/api/login', 'post', () => ({
  success: true,
  message: '',
  data: data.self,
}));
Mock.mock('/api/register', 'post', () => ({
  success: true,
  message: '',
  data: data.self,
}));
Mock.mock('/api/status', 'get', () => ({
  success: true,
  message: '',
  data: data.statusList,
}));
Mock.mock('/api/friends', 'get', () => ({
  success: true,
  message: '',
  data: data.users,
}));
Mock.mock(/\/api\/profile\/(.+)/, 'get', () => ({
  success: true,
  message: '',
  data: data.users[0],
}));
