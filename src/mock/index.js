const Mock = require('mockjs');

const Random = Mock.Random;

function messagesData() {
  const messages = [];

  for (let i = 0; i < 100; i += 1) {
    const message = {
      id: 100 - i,
      from: Random.cname(),
      fromAvatar: Random.dataImage('50x50', '图片'),
      message: Random.csentence(),
    };
    messages.push(message);
  }

  return messages;
}

Mock.mock('/api/test/messages', 'get', messagesData);
