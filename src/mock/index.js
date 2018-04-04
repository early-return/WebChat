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
    date: Random.datetime(),
  };
}

// 用于存放构造的虚拟数据
const data = {
  self: {
    id: 1,
    name: Random.cname(),
    avatar: Random.dataImage('50x50', '自己'),
    infoList: [
      { title: '好友', content: '20', link: '#' },
      { title: '动态', content: '10', link: '#' },
      { title: '测试', content: 'haha', link: '#' },
    ],
  },
  users: [],
  recentMessages: [],
  allMessages: [],
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
  const messages = {
    uid: data.users[i].id,
    messages: [],
  };
  data.allMessages.push(messages);
  for (let j = 0; j < 10; j += 1) {
    const message = generateMessage(data.users[i], data.self);
    data.allMessages[i].messages.push(message);
  }
  for (let j = 0; j < 10; j += 1) {
    const message = generateMessage(data.self, data.users[i]);
    data.allMessages[i].messages.push(message);
  }

  data.allMessages[i].messages.sort((msg1, msg2) => new Date(msg2.date) - new Date(msg1.date));
}

for (let i = 0; i < data.allMessages.length; i += 1) {
  data.recentMessages.push(data.allMessages[i].messages[0]);
}
data.recentMessages.sort((msg1, msg2) => msg2.date - msg1.date);

Mock.mock('/api/messages/recent', 'get', () => data.recentMessages);
Mock.mock(/\/api\/messages\/(\d*)/, 'get', () => {
  const result = data.allMessages[0].messages;
  return result;
});
Mock.mock('/api/auth', 'get', () => ({ user: (data.logged ? data.self : null) }));
Mock.mock(/\/api\/check_user\/(.+)/, 'get', () => ({
  status: 'exist',
}));
Mock.mock('/api/login', 'post', () => {
  data.logged = true;
  return {
    user: data.self,
  };
});
Mock.mock('/api/register', 'post', () => ({
  user: data.self,
}));
