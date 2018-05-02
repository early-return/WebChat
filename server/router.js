const router = require('express').Router();
const account = require('./handler/account');
const friend = require('./handler/friend');
const message = require('./handler/message');

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'this is a test',
    data: null,
  });
});

router.get('/auth/:token', account.auth);
router.get('/check/:email', account.checkEmail);
router.get('/user/:uid', account.getProfile);
router.post('/login', account.login);
router.post('/logout', account.logout);
router.post('/register', account.register);
router.post('/profile/update', account.updateProfile);

router.get('/friends/:uid/:token', friend.getFriends);
router.get('/friends/unknown/:uid/:token', friend.getUnknownFriends);
router.post('/friends/add', friend.addFriend);

router.get('/messages/:uid/:token', message.getAllMessages);

module.exports = router;
