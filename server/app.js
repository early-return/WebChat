const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParse = require('body-parser');

const router = require('./router');

app.use(bodyParse.json());
app.use('/api', router);

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    io.emit('message', data);
  });
});

server.listen(3000, () => {
  console.log('已开始在http://localhost:3000上监听服务器。');
});
