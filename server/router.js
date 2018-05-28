const router = require('express').Router();
const account = require('./handler/account');
const friend = require('./handler/friend');
const message = require('./handler/message');
const group = require('./handler/group');
const status = require('./handler/status');

// 用户相关的API
// 用户验证API，通过登录时下发的Token来验证用户是否登录
router.get('/auth/:token', account.auth);
// 检查邮箱地址是否已注册
router.get('/check/:email', account.checkEmail);
// 通过用户ID获取用户详细信息
router.get('/user/:uid', account.getProfile);
// 提交包含`email`和`password`属性的json对象来进行登录
router.post('/login', account.login);
// 提交包含`token`属性的json对象来移除Token，以达到退出登录的目的
router.post('/logout', account.logout);
// 提交包含`email`,`name`与`password`属性的json对象来进行注册
router.post('/register', account.register);
// 提交用户信息json文件来进行用户信息更新
router.post('/profile/update', account.updateProfile);

// 好友相关API
// 获取用户的所有好友信息，需传入`uid`与`token`进行认证
router.get('/friends/:uid/:token', friend.getFriends);
// 提交一个包含`token`,`fromId`与`toEmail`属性的json对象来添加好友
// token用于对用户进行认证
// fromId与toEmail分别为当前用户ID与欲添加好友邮箱
router.post('/friends/add', friend.addFriend);
router.post('/friends/addwithid', friend.addFriendWithId);
router.post('/friend/remove', friend.deleteFriend);

// 消息相关API
// 获取最近的消息记录，需传入`token`与`uid`进行认证
router.get('/messages/:uid/:token', message.getAllMessages);

// 群组相关API
// 获取最近的群组消息记录，需传入`uid`与`token`进行认证
router.get('/messages/group/:uid/:token', group.getGroupMessages);
// 获取用户已添加的所有群组信息，需传入`uid`与`token`进行认证
router.get('/groups/:uid/:token', group.getGroups);
// 传入一个包含`token`,`uid`与`gname`属性的json对象来创建群组
// gname为欲创建的群组名称
router.post('/groups/create', group.createGroup);
// 传入一个包含`token`,`uid`与`gname`属性的json对象来加入群组
// gname为欲加入的群组名称
router.post('/groups/join', group.addGroup);
router.post('/group/quit', group.quitGroup);

// 动态相关API
// 获取用户好友的动态
// `skip`与`limit`分别为跳过条数与获取条数，用于数据过多时进行分页获取
// `uid`与`token`用于用户认证
router.get('/status/:skip/:limit/:uid/:token', status.getStatus);
// 发布一条新动态
router.post('/status/post', status.publishStatus);

module.exports = router;
