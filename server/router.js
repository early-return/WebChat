const router = require('express').Router();
const account = require('./handler/account');

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
router.post('/register', account.register);
router.post('/profile/update', account.updateProfile);

module.exports = router;
